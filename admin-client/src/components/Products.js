import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setEmails } from './actions/action';
import { Table, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Products = ({ updateEmailCount }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(5);

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

  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="products-main-container">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <Table responsive striped bordered hover className="min-w-full text-left text-sm font-light">
              <thead className="bg-white text-black dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEmails.map((email, index) => (
                  <tr
                    key={email._id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} // Alternate row colors
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{email._id}</td>
                    <td className="whitespace-nowrap px-6 py-4">{email.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{email.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">{email.mobile}</td>
                    <td className="whitespace-nowrap px-6 py-4">{email.subject}</td>
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
                          style={{ 
                           border: 'none',
                           color: '#c53737',
                           cursor: 'pointer',
                           marginTop:"1rem",
                           marginLeft:"1rem",
                           }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
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