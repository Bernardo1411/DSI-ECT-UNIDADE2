import { useState, useEffect } from 'react';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Modal, Typography } from '@mui/material';
import { getUser, postBuyCripto, postSellCripto, postSendDolar, postWithdrawDolar } from '../utils/APICrypto';
import { postRemoveUser } from '../utils/APIUser';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#232F3E',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    width: '100%',
    minHeight: '300px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: '10px',
  },
  errorMessage: {
    color: '#FF0000',
    marginBottom: '10px',
  },
  textField: {
    marginBottom: '10px',
    width: '300px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  button: {
    width: '100%',
    margin: '0 10px',
    backgroundColor: '#FF9900',
    color: '#FFFFFF',
  },
  totalValueContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: '100px',
  },
  totalValue: {
    fontSize: '18px',
    color: '#CCCCCC',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  tableContainer: {
    maxWidth: '100%',
    marginTop: '20px',
  },
  tableHead: {
    backgroundColor: '#DDDDDD',
  },
  listItem: {
    backgroundColor: '#DDDDDD', // Update the background color to a darker shade of gray
    marginBottom: '10px',
    borderRadius: '5px',
    padding: '10px',
    color: '#000',
  },
  logoutButton: {
    backgroundColor: '#FF9900',
    color: '#FFFFFF',
    marginTop: '20px',
    width: '200px',
    fontWeight: 'bold',
  },
  removeUserButton: {
    backgroundColor: '#F0F2F5',
    color: '#232F3E',
    marginTop: '20px',
    position: 'absolute',
    fontSize: '12px',
    right: 0,
    top: 0,
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#F0F2F5',
    width: '300px',
    height: '200px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
}

const UserPage = () => {
  const [value, setValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [conversionList, setConversionList] = useState([]);
  const [totalValueBitcoin, setTotalValueBitcoin] = useState(0);
  const [totalValueDollar, setTotalValueDollar] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const userName = sessionStorage.getItem('userName');

  const getUserAction = async () => {
    try {
      const response = await getUser(userName);
      return response;
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const postBuyCriptoAction = async () => {
    try {
      setErrorMessage('');
      const response = await postBuyCripto(userName, value);

      if (response.status === 500) throw response;

      setConversionList(response.user.transactions);
      setTotalValueBitcoin(response.user.totalValueInBitcoin);
      setTotalValueDollar(response.user.totalValueInDolar);
      return response;
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const postSellCriptoAction = async () => {
    try {
      setErrorMessage('');
      const response = await postSellCripto(userName, value);

      if (response.status === 500) throw response;

      setConversionList(response.user.transactions);
      setTotalValueBitcoin(response.user.totalValueInBitcoin);
      setTotalValueDollar(response.user.totalValueInDolar);
      return response;
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const postSendDolarAction = async () => {
    try {
      setErrorMessage('');
      const response = await postSendDolar(userName, value);

      if (response.status === 500) throw response;

      setTotalValueDollar(response.user.totalValueInDolar);

      return response;
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const postWithdrawDolarAction = async () => {
    try {
      setErrorMessage('');
      const response = await postWithdrawDolar(userName, value);

      if (response.status === 500) throw response;

      setTotalValueDollar(response.user.totalValueInDolar);

      return response;
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLogin');
    sessionStorage.removeItem('userName');
    window.location.assign('http://localhost:5173/');
  };

  const handleRemoveUser = async (e) => {
    e.preventDefault();
    try {
      const { remove, message } = await postRemoveUser(userName);
      if (remove) {
        sessionStorage.removeItem('isLogin');
        sessionStorage.removeItem('userName');
        window.location.assign('http://localhost:5173/');
      } else {
        throw message;
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await getUserAction();
      if (response && response.user && response.user.transactions) {
        setConversionList(response.user.transactions);
        setTotalValueBitcoin(response.user.totalValueInBitcoin);
        setTotalValueDollar(response.user.totalValueInDolar);
      }
    })();
  }, []);

  return (
    <div style={styles.container}>
      <Modal
        style={styles.modalContainer}
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div style={styles.modal}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{color: '#232F3E'}}>
            Confirme a operação
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRemoveUser}
            style={styles.logoutButton}
          >
            Remover
          </Button>
        </div>
      </Modal>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpenModal(true)}
        style={styles.removeUserButton}
      >
        Remover conta
      </Button>
      <div style={styles.header}>
        <p style={styles.title}>Dashboard</p>
      <TextField
        label="Value"
        variant="outlined"
        value={value}
        onChange={handleValueChange}
        style={styles.textField}
        InputProps={{
          style: { color: 'white', },
        }}
      />
      <div style={styles.totalValueContainer}>
        <p style={styles.totalValue}>Bitcoin: {totalValueBitcoin}   </p>
        <p style={styles.totalValue}>Dólar: {totalValueDollar.toFixed(2)}</p>
      </div>
      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      <div style={styles.buttonContainer}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={postBuyCriptoAction}
              style={styles.button}
            >
              Convert Dollar to Bitcoin
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={postSellCriptoAction}
              style={styles.button}
            >
              Convert Bitcoin to Dollar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={postSendDolarAction}
              style={styles.button}
            >
              Receive Dollar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={postWithdrawDolarAction}
              style={styles.button}
            >
              Withdraw Dollar
            </Button>
          </Grid>
        </Grid>
      </div>
      </div>

      <TableContainer style={styles.tableContainer}>
        <Table>
          <TableHead style={styles.tableHead}>
            <TableRow>
              <TableCell>Bitcoin</TableCell>
              <TableCell>Dollar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conversionList.slice(-5).reverse().map((conversion, index) => (
              <TableRow key={index}>
                <TableCell>{conversion.valueInBitcoin}</TableCell>
                <TableCell>{conversion.valueInDolar}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </div>
  );
};

export default UserPage;
