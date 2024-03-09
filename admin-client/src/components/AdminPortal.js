// src/components/AdminPortal.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setEmails } from '../components/actions/action';

const AdminPortal = () => {
  const emails = useSelector(state => state.emails);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch emails from the Express server
    axios.get('/api/emails')
      .then(response => dispatch(setEmails(response.data)))
      .catch(error => console.error('Error fetching emails:', error));
  }, [dispatch]);

  return (
    <div>
      <h1>Admin Portal</h1>
      <ul>
        {emails.map(email => (
          <li key={email._id}>{email.name} - {email.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPortal;
