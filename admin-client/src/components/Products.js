import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setEmails } from './actions/action';
import { Table, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Products = ({ updateEmailCount }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(7); // Limit to 7 emails per page by default

  const emails = useSelector((state) => state.emails);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get('/api/emails')
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

  // Calculate pagination logic
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='products-main-container'>
      <Table striped bordered hover style={{ marginTop: '2rem', width: '100%' }}>
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
          {currentEmails.map((email) => (
            <tr key={email._id}>
              <td>{email._id}</td>
              <td>{email.name}</td>
              <td>{email.email}</td>
              <td>{email.mobile}</td>
              <td>{email.subject}</td>
              <td>
                <button
                  onClick={() => handleDelete(email._id)}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ border: 'none', color: '#c53737', cursor: 'pointer' }}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {emails.length > emailsPerPage && (
        <Pagination className="justify-content-center">
          {[...Array(Math.ceil(emails.length / emailsPerPage)).keys()].map((number) => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
};

export default Products;
