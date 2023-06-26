import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { postLoginUser, postSignUpUser } from '../utils/APIUser';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    marginBottom: '20px',
    width: '300px',
  },
  button: {
    background: '#ff9900',
    color: '#ffffff',
    marginBottom: '10px',
    width: '200px',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
  },
};

const InitialPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { login, message } = await postLoginUser(userName, password);
      if (login) {
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('userName', userName);
        window.location.assign('http://localhost:5173/user');
      } else {
        throw message;
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { login, message } = await postSignUpUser(userName, password);
      if (login) {
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('userName', userName);
        window.location.assign('http://localhost:5173/user');
      } else {
        throw message;
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form}>
        <TextField
          label="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={styles.textField}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.textField}
        />
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        <Button
          type="submit"
          onClick={handleLogin}
          variant="contained"
          style={styles.button}
        >
          Login
        </Button>
        <Button
          type="submit"
          onClick={handleSignUp}
          variant="contained"
          style={styles.button}
        >
          SignUp
        </Button>
      </form>
    </div>
  );
};

export default InitialPage;
