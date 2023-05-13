import './App.css';
import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import InitialPage from './pages/InitialPage';
import UserPage from './pages/UserPage';

function App() {
  const userLogged = false;
  let route = <Route exact path="/" Component={InitialPage} />;

  if(userLogged) route = <Route path="/user" Component={UserPage} />;

  return (
    <Container>
      <Routes>
        {route}
      </Routes>
    </Container>
  )
}

export default App
