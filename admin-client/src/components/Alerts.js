import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Alerts = ({ onEmailsUpdate }) => {
  const [emails, setEmails] = useState([]);
  const [newEmails, setNewEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch emails
    const fetchEmails = async () => {
      try {
        const response = await axios.get('/api/emails');
        const allEmails = Array.isArray(response.data) ? response.data : [];
        setEmails(allEmails);

        const lastViewedEmailCount = parseInt(localStorage.getItem('lastViewedEmailCount'), 10) || 0;
        const newEmailsList = allEmails.slice(lastViewedEmailCount);
        setNewEmails(newEmailsList);

        if (onEmailsUpdate) onEmailsUpdate(newEmailsList.length);

      } catch (error) {
        console.error('Error fetching emails:', error);
        setError('Error fetching emails. Please try again later.');
      }
    };

    fetchEmails(); // Initial fetch
    const interval = setInterval(fetchEmails, 5000); // Fetch emails every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [onEmailsUpdate]);

  const handleViewEmails = () => {
    localStorage.setItem('lastViewedEmailCount', emails.length.toString());
    setNewEmails([]);
  };

  const handleCheckboxChange = (emailId) => {
    setSelectedEmails((prevSelectedEmails) =>
      prevSelectedEmails.includes(emailId)
        ? prevSelectedEmails.filter((id) => id !== emailId)
        : [...prevSelectedEmails, emailId]
    );
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedEmails(newEmails.map((email) => email._id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleMarkSelectedAsViewed = () => {
    const remainingEmails = newEmails.filter(
      (email) => !selectedEmails.includes(email._id)
    );
    setNewEmails(remainingEmails);
    setSelectedEmails([]);

    const lastViewedEmailCount = parseInt(localStorage.getItem('lastViewedEmailCount'), 10) || 0;
    const newLastViewedEmailCount = lastViewedEmailCount + selectedEmails.length;
    localStorage.setItem('lastViewedEmailCount', newLastViewedEmailCount.toString());

    if (onEmailsUpdate) onEmailsUpdate(remainingEmails.length);
  };

  return (
    <div className="products-main-container">
      <h1>Alerts</h1>
      <div className="flex gap-4 mt-4">
        <Button
          onClick={handleViewEmails}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 mr-2"
          style={{ margin: "1rem 1rem 1rem 0" }}
        >
          Mark all as viewed
        </Button>
        {selectedEmails.length > 0 && (
          <Button
            onClick={handleMarkSelectedAsViewed}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Mark selected as viewed
          </Button>
        )}
        <div className="ml-auto">
          <Badge bg="danger">{newEmails.length}</Badge>
        </div>
      </div>
      {error && <p>{error}</p>}
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 mt-3">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                </tr>
              </thead>
              <tbody>
                {newEmails.length > 0 ? (
                  newEmails.map((email) => (
                    <tr key={email._id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedEmails.includes(email._id)}
                          onChange={() => handleCheckboxChange(email._id)}
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{email._id}</td>
                      <td className="whitespace-nowrap px-6 py-4">{email.name}</td>
                      <td className="whitespace-nowrap px-6 py-4">{email.email}</td>
                      <td className="whitespace-nowrap px-6 py-4">{email.mobile}</td>
                      <td className="whitespace-nowrap px-6 py-4">{email.subject ? email.subject : 'No Subject'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No new alerts</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
