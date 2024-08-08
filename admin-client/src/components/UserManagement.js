import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import './login.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className='products-main-container products-main-container-1'>
      <div className="user-management">
        <h2>User Management</h2>
        <div className="user-lists">
          <div className="user-list">
            <h3>Super Admins</h3>
            <ul>
              {users
                .filter(user => user.role === 'superadmin')
                .map(user => (
                  <li key={user._id} className="user-item">
                    <span>{user.email}</span>
                    <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
                      <FaTrash />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <div className="user-list">
            <h3>Normal Users</h3>
            <ul>
              {users
                .filter(user => user.role === 'user')
                .map(user => (
                  <li key={user._id} className="user-item">
                    <span>{user.email}</span>
                    <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
                      <FaTrash />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
