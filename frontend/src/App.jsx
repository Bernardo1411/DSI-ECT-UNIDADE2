import { Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';

import InitialPage from './pages/InitialPage';
import UserPage from './pages/UserPage';

const style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    backgroundColor: '#F0F2F5',
}};

function App() {
  const userLogged = sessionStorage.getItem('isLogin') === 'true';
  let route = <Route exact path="/" Component={InitialPage} />;

  if (userLogged) {
    route = <Route path="/user" Component={UserPage} />;
  }

  return (
    <Container sx={style.container}>
      <Routes>
        {route}
      </Routes>
    </Container>
  );
}

export default App
