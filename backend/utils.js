const fs = require('fs');
const util = require('util');
const writeFile = (fileName, data) => util.promisify(fs.writeFile)(fileName, data, 'utf8');
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');

exports.insertNewUSerToDataBase = async (listUsers) => {
   const JSONData = JSON.stringify(listUsers);
   const err = await writeFile('userData.json', JSONData)

    return err;
}

exports.accessDataBase = async () => {
    const dataJSON = await readFile('userData.json')
    
    const data = JSON.parse(dataJSON)

     return data;
 }

exports.checkUserExists = (user, users) => {
    let keyExists = false;

    for (const obj of users) {
      if (obj.hasOwnProperty(user)) {
        keyExists = true;
        break;
      }
    }

    return keyExists;
}

exports.returnUser = (user, users) => {
    let objectWithKey = null;

    for (const obj of users) {
      if (obj.hasOwnProperty(user)) {
        objectWithKey = obj[user];
        break;
      }
    }

    return objectWithKey;
}

exports.updateUser = async (user, users, data) => {
    let objectWithKey = null;

    for (const obj of users) {
      if (obj.hasOwnProperty(user)) {
        obj[user].transactions = data.transactions;
        obj[user].totalValueInDolar = data.totalValueInDolar;
        obj[user].totalValueInBitcoin = data.totalValueInBitcoin;

        objectWithKey = users;
        break;
      }
    }

    const JSONData = JSON.stringify(objectWithKey);
    const err = await writeFile('userData.json', JSONData);

    return {err, listUsers: objectWithKey};
}

exports.removeUser = async (user, users) => {
  let updatedUsers = users.filter(obj => !obj.hasOwnProperty(user));

  const JSONData = JSON.stringify(updatedUsers);
  const err = await writeFile('userData.json', JSONData);

  return { err };
}

exports.generateId = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();    
  return `${day}${month}${year}${(Math.random()*1000000).toFixed()}`
}
