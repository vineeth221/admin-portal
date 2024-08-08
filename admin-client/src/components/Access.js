import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaMinus } from 'react-icons/fa'; // Importing icons
import './login.css'; // Import the CSS file for styling

const Access = () => {
  const [grantEmail, setGrantEmail] = useState('');
  const [removeEmail, setRemoveEmail] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState(''); // For creating new users
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // To determine the type of message
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000); // Clear the message after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleGrantSuperAdmin = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(grantEmail)) {
      setMessage('Invalid email format');
      setMessageType('error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found. Please log in again.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post(
        '/api/access/grant-superadmin',
        { email: grantEmail },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setMessage('Super admin access granted.');
        setMessageType('success');
        setGrantEmail('');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage('Unauthorized. Please log in again.');
      } else {
        setMessage(`Error: ${error.response?.data?.error || error.message}`);
      }
      setMessageType('error');
    }
  };

  const handleRemoveSuperAdmin = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(removeEmail)) {
      setMessage('Invalid email format');
      setMessageType('error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found. Please log in again.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post(
        '/api/access/remove-superadmin',
        { email: removeEmail },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setMessage('Super admin access removed.');
        setMessageType('success');
        setRemoveEmail('');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage('Unauthorized. Please log in again.');
      } else {
        setMessage(`Error: ${error.response?.data?.error || error.message}`);
      }
      setMessageType('error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(newUserEmail) || newUserPassword.length < 6) {
      setMessage('Invalid email format or password too short');
      setMessageType('error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found. Please log in again.');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post(
        '/api/access/create-user',
        { email: newUserEmail, password: newUserPassword },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201) {
        setMessage('User created successfully.');
        setMessageType('success');
        setNewUserEmail('');
        setNewUserPassword('');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage('Unauthorized. Please log in again.');
      } else {
        setMessage(`Error: ${error.response?.data?.error || error.message}`);
      }
      setMessageType('error');
    }
  };

  return (
    <div className='products-main-container products-main-container-1'>
      <div className="access-container">
        <h2>Access Management</h2>
        {userRole === 'superadmin' ? (
          <div className="access-forms">
            <div className="left-form">
              <h3>Manage Super Admin Access</h3>
              <form onSubmit={handleGrantSuperAdmin}>
                <input
                  type="email"
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  placeholder="Enter email to grant super admin access"
                  required
                />
                <button type="submit">
                  Grant Access
                </button>
              </form>
              <form onSubmit={handleRemoveSuperAdmin}>
                <input
                  type="email"
                  value={removeEmail}
                  onChange={(e) => setRemoveEmail(e.target.value)}
                  placeholder="Enter email to remove super admin access"
                  required
                />
                <button type="submit">
                  Remove Access
                </button>
              </form>
            </div>
            <div className="right-form">
              <h3>Create New User</h3>
              <form onSubmit={handleCreateUser}>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Enter email for new user"
                  required
                />
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Enter password for new user"
                  required
                />
                <button type="submit">Create User</button>
              </form>
            </div>
          </div>
        ) : (
          <p>You do not have permission to manage access.</p>
        )}
        {message && <p className={`message ${messageType}`}>{message}</p>}
      </div>
    </div>
  );
};

export default Access;
