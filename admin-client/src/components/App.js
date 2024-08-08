import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './Admin.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Customers from './Customers';
import Alerts from './Alerts';
import LoginForm from './LoginForm';
import UserManagement from './UserManagement';
import Access from './Access';
import ForgotPassword from './ForgotPassword'; // Import the ForgotPassword component

const TIMEOUT_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const timeoutRef = useRef(null); // Reference to store timeout ID

  // Memoize handleLogout
  const handleLogout = useCallback(() => {
    setToken('');
    localStorage.removeItem('token');
    clearTimeout(timeoutRef.current); // Clear the timeout when logging out
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    resetTimeout(); // Reset the timeout on login
  };

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, TIMEOUT_DURATION);
  }, [handleLogout]);

  useEffect(() => {
    const handleUserActivity = () => {
      resetTimeout();
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    // Set the initial timeout when the component mounts
    resetTimeout();

    return () => {
      // Cleanup event listeners and timeout on unmount
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearTimeout(timeoutRef.current);
    };
  }, [resetTimeout]);

  const PrivateRoute = ({ element }) => (
    token ? element : <Navigate to="/login" />
  );

  return (
    <Router>
      <div className={token ? 'grid-container' : ''}>
        {token && <Header handleLogout={handleLogout} />}
        {token && <Sidebar />}
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginForm setToken={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add forgot password route */}
          <Route path="/dashboard" element={<PrivateRoute element={<Home />} />} />
          <Route path="/customers" element={<PrivateRoute element={<Customers />} />} />
          <Route path="/alerts" element={<PrivateRoute element={<Alerts />} />} />
          <Route path="/access" element={<PrivateRoute element={<Access />} />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
