import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './login.css'; // Import the CSS file for styling
import Img from './images/build8.jpeg'

const LoginForm = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-left">
          <h2>Welcome back</h2>
          <p className="description">Welcome back! Please enter your details.</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              {/* <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember for 30 days</label>
              </div> */}
              <Link to="/forgot-password" className="forgot-password">Forgot password</Link>
            </div>
            <button type="submit" className="submit-button">Sign in</button>
          </form>
        </div>
        <div className="login-right">
          <img
            src={Img}// Replace with your image URL
            alt="Background"
            className="background-image"
          />
          <div className="overlay-text">
            <span>
              "We've been using Untitle to kickstart every new project and can't imagine working without it."
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
