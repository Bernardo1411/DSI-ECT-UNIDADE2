require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');
const axios = require('axios');
const { insertNewUSerToDataBase, accessDataBase, checkUserExists, returnUser, updateUser, generateId, removeUser } = require('./utils');
const { validatePassword, validateUserName } = require('./validate');
const { API_URL_BITCOIN } = process.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const { userName } = req.query;

    if(!validateUserName(userName)) return res.send({message: 'Nome do usuário inválido!'});

    const users = await accessDataBase();

    const user = returnUser(userName, users);

    if(user) return res.status(200).send({ message: 'Sucesso!', user })
    else return res.status(400).send({ message: 'Usuário não encontrado'})
});

app.post('/newAccount', async (req, res) => {
    const { userName, password } = req.body;

    if(!validateUserName(userName)) return res.status(400).send({message: 'Nome do usuário inválido!'});
    if(!validatePassword(password)) return res.status(400).send({message: 'Senha inválida!'});

    const listUsers = [];
    
    const users = await accessDataBase();

    const userExists = checkUserExists(userName, users)

    if(!userExists){
        listUsers.push(...users);

        const userRegister = {
            [`${userName}`]: {
            transactions: [
                {
                valueInBitcoin:0, 
                valueInDolar:0,
                id: generateId(),
                },
            ],
              totalValueInDolar: 0,
              totalValueInBitcoin: 0,
              password,
          }
        }

        listUsers.push(userRegister);

        const err = await insertNewUSerToDataBase(listUsers);

        if(err) return res.status(400).send({message: 'Erro ao salvar usuário.', login: false})
        else{
            const user = await returnUser(userName, listUsers);

            return res.status(200).send({message: 'Convertion saved successfuly', user, login: true})
        }
    }
    else {
        return res.status(400).send({message: 'Usuário já axistente!', login: false})
    }
})

app.post('/buycripto', async (req, res) => {
    const { userName, value } = req.body;
  
    if (!validateUserName(userName))
      return res.status(400).send({ message: 'Nome do usuário inválido!' });
  
    const numberValue = Number(value);

    if (numberValue <= 0)
      return res.status(400).send({ message: 'Valor deve ser maior que zero!' });
  
    try {
      const response = await axios.get(API_URL_BITCOIN);

      const bitcoinToUSD = response.data.last_trade_price;

      const valueInBitcoin = value / bitcoinToUSD;
  
      const users = await accessDataBase();
      const user = returnUser(userName, users);

      if (user.totalValueInDolar < value)
        return res.status(400).send({ message: 'Saldo insuficiente.' });

      user.transactions.push({
        valueInBitcoin,
        valueInDolar: -numberValue,
        id: generateId(),
      });

      user.totalValueInDolar = Number(user.totalValueInDolar) - numberValue;
      user.totalValueInBitcoin = Number(user.totalValueInBitcoin) + valueInBitcoin;
  
      const resUpdate = await updateUser(userName, users, user);

      if (!resUpdate.err) {
        const newUser = await returnUser(userName, resUpdate.listUsers);

        return res.status(200).send({ message: 'Conversão realizada.', user: newUser });
      } else {
        console.log('linha 113')
        return res.status(400).send({ message: 'Erro ao realizar a conversão' });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ message: 'Erro ao acessar a API.', error: error.message });
    }
  });

  app.post('/sellcripto', async (req, res) => {
    const { userName, value } = req.body;
  
    if (!validateUserName(userName))
      return res.status(400).send({ message: 'Nome do usuário inválido!' });
  
    const numberValue = Number(value);

    if (numberValue <= 0)
      return res.status(400).send({ message: 'Valor deve ser maior que zero!' });
  
    try {
      const response = await axios.get(API_URL_BITCOIN);
  
      const bitcoinToUSD = response.data.last_trade_price;
  
      const valueInDolar = numberValue * bitcoinToUSD;
  
      const users = await accessDataBase();
      const user = returnUser(userName, users);
  
      if (user.totalValueInBitcoin < value)
        return res.status(400).send({ message: 'Saldo insuficiente.' });
  
      user.transactions.push({
        valueInBitcoin: -numberValue,
        valueInDolar: valueInDolar,
        id: generateId(),
      });
  
      user.totalValueInDolar = Number(user.totalValueInDolar) + valueInDolar;
      user.totalValueInBitcoin = Number(user.totalValueInBitcoin) - numberValue;
  
      const resUpdate = await updateUser(userName, users, user);
  
      if (!resUpdate.err){
        const newUser = await returnUser(userName, resUpdate.listUsers);

        return res
          .status(200)
          .send({ message: 'Conversão realizada.',  user: newUser });
      } else
        return res.status(400).send({ message: 'Erro ao realizar a conversão' });
    } catch (error) {
      return res
        .status(500)
        .send({ message: 'Erro ao acessar a API.', error: error.message });
    }
  });

app.post('/senddolar', async (req, res) => {
    const { userName, value } = req.body;

    if(!validateUserName(userName)) return res.status(400).send({message: 'Nome do usuário inválido!'});

    const numberValue = Number(value);

    if (numberValue <= 0)
      return res.status(400).send({ message: 'Valor deve ser maior que zero!' });

    const users = await accessDataBase();
    const user = returnUser(userName, users);

    user.totalValueInDolar = Number(user.totalValueInDolar) + numberValue;

    const resUpdate = await updateUser(userName, users, user);

    if(!resUpdate.err){
        const newUser = await returnUser(userName, resUpdate.listUsers);

        return res.status(200).send({ message: 'Deposito realizado com sucesso.', user: newUser })
    } 
    else return res.status(400).send({ message: 'Erro ao receber dólar.' })
})

app.post('/withdrawdolar', async (req, res) => {
    const { userName, value } = req.body;

    if(!validateUserName(userName)) return res.status(400).send({message: 'Nome do usuário inválido!'});

    const numberValue = Number(value);
    
    if (numberValue <= 0)
      return res.status(400).send({ message: 'Valor deve ser maior que zero!' });

    const users = await accessDataBase();
    const user = returnUser(userName, users);

    if(user.totalValueInDolar < value) return res.status(400).send({message: 'Saldo insuficiente.'})

    user.totalValueInDolar = Number(user.totalValueInDolar) - numberValue;

    const resUpdate = await updateUser(userName, users, user);

    if(!resUpdate.err){

        const newUser = await returnUser(userName, resUpdate.listUsers);

        return res.status(200).send({ message: 'Saque realizado com sucesso.', user: newUser })
    } 
    else return res.status(400).send({ message: 'Erro ao sacar dólar.' })
})

app.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    if(!validateUserName(userName)) return res.status(400).send({message: 'Nome do usuário inválido!'});
    if(!validatePassword(password)) return res.status(400).send({message: 'Nome do usuário inválido!'});

    const users = await accessDataBase();
    const user = returnUser(userName, users);
    
    if(user){
        if(user.password === password) return res.status(200).send({message: 'Usuário Logado!', user, login: true});
        else return res.status(400).send({message: 'Usuário ou senha inválido', login: false})
    }
    else {
        return res.status(400).send({message: 'Usuário ou senha inválido', login: false})
    }
})

app.delete('/removeUser', async (req, res) => {
  const { userName } = req.body;

  if (!validateUserName(userName))
    return res.status(400).send({ message: 'Nome do usuário inválido!', remove: false });

  const users = await accessDataBase();
  const userExists = checkUserExists(userName, users);

  if (userExists) {
    const { err } = await removeUser(userName, users);

    if (err) {
      return res.status(400).send({ message: 'Erro ao remover usuário.', remove: false });
    } else {
      return res
        .status(200)
        .send({ message: 'Usuário removido com sucesso.', remove: true });
    }
  } else {
    return res.status(400).send({ message: 'Usuário não encontrado.', remove: false });
  }
});

app.listen(port);
