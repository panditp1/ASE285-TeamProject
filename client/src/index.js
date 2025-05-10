import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './Login';
import { UserProvider, useUser } from './UserContext';
import './styles.css';

function LoginFirst() {
  const { user, setUser } = useUser();

  return (
    <>
      {user ? <App /> : <Login setUser={setUser} />}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <LoginFirst />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
