// components/Products.js

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setEmails, setNewEmails } from './actions/action';
import { Table, Pagination, OverlayTrigger, Tooltip, FormControl, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import CryptoJS from 'crypto-js';

const secretKey = 'your-encryption-key';

// Encrypt ID for storage
const encryptId = (id) => CryptoJS.AES.encrypt(id, secretKey).toString();

// Decrypt ID for usage
const decryptId = (encryptedId) => {
  const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(5);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const emails = useSelector((state) => state.emails);
  const newEmails = useSelector((state) => state.newEmails); // Add this line
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
    }
  }, []);

  useEffect(() => {
    axios
      .get('/api/emails')
      .then((response) => {
        const fetchedEmails = response.data.map((email, index) => ({
          ...email,
          displayId: index + 1, // Display ID starting from 1
          encryptedId: encryptId(email._id),
        }));
        dispatch(setEmails(fetchedEmails));
        // Update newEmails state
        const lastViewedEmailCount = parseInt(localStorage.getItem('lastViewedEmailCount'), 10) || 0;
        const newEmails = fetchedEmails.slice(lastViewedEmailCount);
        dispatch(setNewEmails(newEmails));
      })
      .catch((error) => console.error('Error fetching emails:', error));
  }, [dispatch]);

  const handleDeleteClick = (emailId) => {
    setSelectedEmailId(emailId);
  };

  const handleDeleteConfirm = async () => {
    const decryptedId = decryptId(selectedEmailId);
    try {
      await axios.delete(`/api/emails/${decryptedId}`);
      const remainingEmails = emails.filter((email) => email.encryptedId !== selectedEmailId);
      dispatch(setEmails(remainingEmails));

      // Update newEmails state
      const lastViewedEmailCount = parseInt(localStorage.getItem('lastViewedEmailCount'), 10) || 0;
      const newEmails = remainingEmails.slice(lastViewedEmailCount);
      dispatch(setNewEmails(newEmails));

      setSelectedEmailId(null);
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const handleDeleteCancel = () => {
    setSelectedEmailId(null);
  };

  // Get current emails
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;

  // Filter emails based on search term
  const filteredEmails = emails.filter(
    (email) =>
      email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.displayId.toString().includes(searchTerm)
  );

  const currentEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <div className="text-center">
        <p className="mb-2">Are you sure?</p>
        <button
          className="btn btn-sm btn-danger mr-2"
          onClick={handleDeleteConfirm}
        >
          Yes
        </button>
        <button className="btn btn-sm btn-secondary" onClick={handleDeleteCancel}>
          No
        </button>
      </div>
    </Tooltip>
  );

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(emails.map(email => ({
      ...email,
      _id: email.displayId, // Display ID instead of actual ID
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Emails');
    XLSX.writeFile(workbook, 'emails.xlsx');
  };

  return (
    <div className="products-main-container relative">
      <div className="flex justify-between items-center mb-3" style={{ display: "flex", alignItems: "center" }}>
        <InputGroup className="w-50">
          <FormControl
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:outline-none" // Remove blue outline
          />
        </InputGroup>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="download-tooltip">Download Excel</Tooltip>}
        >
          <button
            onClick={handleDownloadExcel}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              position: 'absolute',
              right: '1rem', // Adjust position as needed
            }}
          >
            <FontAwesomeIcon
              icon={faFileExcel}
              style={{ color: 'green', fontSize: '24px' }}
            />
          </button>
        </OverlayTrigger>
      </div>

      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <Table responsive striped bordered hover className="min-w-full text-left text-sm font-light">
              <thead className="bg-white text-black dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">ID</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Email</th>
                  <th scope="col" className="px-6 py-4">Phone</th>
                  <th scope="col" className="px-6 py-4">Message</th>
                  {userRole === 'superadmin' && (
                  <th scope="col" className="px-6 py-4">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentEmails.map((email, index) => (
                  <tr key={email.encryptedId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{email.displayId}</td>
                    <td className="whitespace-nowrap px-6 py-4">{email.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{email.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">{email.mobile}</td>
                    <td className="whitespace-nowrap px-6 py-4">{email.subject ? email.subject : 'No Subject'}</td>
                    {userRole === 'superadmin' && (
                    <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip}
                          show={selectedEmailId === email.encryptedId}
                        >
                          <span>
                            <button
                              onClick={() => handleDeleteClick(email.encryptedId)}
                              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                style={{
                                  border: 'none',
                                  color: '#c53737',
                                  cursor: 'pointer',
                                  marginTop: '1rem',
                                  marginLeft: '1rem',
                                }}
                              />
                            </button>
                          </span>
                        </OverlayTrigger>
                    </td>
                      )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <Pagination>
          {[...Array(Math.ceil(filteredEmails.length / emailsPerPage)).keys()].map(number => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default Products;
