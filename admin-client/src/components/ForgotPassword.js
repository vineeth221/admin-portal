import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Import the CSS file for styling
import Img from './images/build8.jpeg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'reset'

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleRequestPasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/verify-email', { email });
      if (response.status === 200) {
        setStep('reset'); // Proceed to password reset form
        setMessage('Email verified. Please enter your new password.');
        setError('');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError('Email not found.');
      setMessage('');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reset-password', { email, newPassword });
      if (response.status === 200) {
        setMessage('Password updated successfully.');
        setEmail('');
        setNewPassword('');
        setStep('request');
        setError('');
        // Redirect to login page
        navigate('/login');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Error updating password.');
      setMessage('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-left">
          <h2>{step === 'request' ? 'Forgot Password' : 'Reset Password'}</h2>
          <p className="description">
            {step === 'request' ? 'Please enter your email to reset your password.' : 'Please enter your new password.'}
          </p>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={step === 'request' ? handleRequestPasswordReset : handleResetPassword}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={step === 'reset'} // Disable email input in reset step
              />
              {step === 'request' && (
                <p className="back-to-login" onClick={() => navigate('/login')}>
                  Back to Login
                </p>
              )}
            </div>
            {step === 'reset' && (
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <button type="submit" className="submit-button">
              {step === 'request' ? 'Verify Email' : 'Update Password'}
            </button>
          </form>
        </div>
        <div className="login-right">
          <img
            src={Img}
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

export default ForgotPassword;
