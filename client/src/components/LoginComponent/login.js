import React, { useState } from 'react';
import axios from 'axios';
import { AccountCircle, Lock, Person } from '@mui/icons-material'; 
import './login.css';

const LoginComponent = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/sessions', {
        username,
        password,
      });
      const accessToken = response.data.accessToken;
      onLogin(accessToken, username);
    } catch (error) {
      alert('Invalid username or password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="avatar-container">
        <div className="avatar-icon">
          <Person />
        </div>
      </div>
      <div className="input-container">
        <div className="input-icon">
          <AccountCircle />
        </div>
        <input
          type="text"
          placeholder="Username" style={{marginLeft: "10px"}}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <hr></hr>
      </div>
      <div className="input-container">
        <div className="input-icon">
          <Lock />
        </div>
        <input
          type="password"
          placeholder="Password" style={{marginLeft: "10px"}}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
         <hr style={{borderColor: ""}}></hr>
      </div>
     


     <div className='login-button-container'>
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
      </div>
    </div>
  );
};

export default LoginComponent;



