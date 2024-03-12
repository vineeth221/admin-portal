import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setEmails } from './actions/action';

const Products = ({ updateEmailCount }) => {
  const emails = useSelector((state) => state.emails);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch emails from the Express server
    axios
      .get('/emails')
      .then((response) => dispatch(setEmails(response.data)))
      .catch((error) => console.error('Error fetching emails:', error));
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/emails/${id}`);
      const response = await axios.get('/api/emails');
      dispatch(setEmails(response.data));
      updateEmailCount(response.data.length);
      console.log('Email deleted successfully');
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };
  
  return (
    <div>
      <table style={{marginTop:"2rem", width:"100%"}} striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr key={email._id}>
              <td>{email._id}</td>
              <td>{email.name}</td>
              <td>{email.email}</td>
              <td>{email.mobile}</td>
              <td>{email.subject}</td>
              <td>
                <button onClick={() => handleDelete(email._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
