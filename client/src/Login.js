import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './styles.css';

function Login() {
  const { setUser } = useUser();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLoginChange = e =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleLoginSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', {
        email: loginForm.email,
        password: loginForm.password
      });

      if (response.data.success) {
        setUser({ email: loginForm.email });
        setLoginError('');
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } catch (err) {
      setLoginError('Invalid email or password.');
    }
  };

  return (
    <div className="container">
      <h1>Login to Inventory Manager</h1>
      <form className="form" onSubmit={handleLoginSubmit}>
        <input type="email" name="email" placeholder="Email" value={loginForm.email} onChange={handleLoginChange} required />
        <input type="password" name="password" placeholder="Password" value={loginForm.password} onChange={handleLoginChange} required />
        <button type="submit">Login</button>
      </form>
      {loginError && <p className="error">{loginError}</p>}
    </div>
  );
}

export default Login;
