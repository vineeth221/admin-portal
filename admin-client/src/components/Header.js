import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BsFillBellFill, BsPersonCircle, BsSearch, BsBoxArrowRight, BsEnvelope } from 'react-icons/bs';
import { Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode as a named import
import './Admin.css';

function Header({ OpenSidebar, handleLogout }) {
  const emailCount = useSelector((state) => state.emailCount);
  const [showDropdown, setShowDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [newEmailCount, setNewEmailCount] = useState(0);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // State to store user's email
  const navigate = useNavigate();

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

        // Decode the token to get the logged-in user's ID
        const decodedToken = jwtDecode(token);
        const loggedInUser = response.data.find(user => user._id === decodedToken.id);
        if (loggedInUser) {
          setUserEmail(loggedInUser.email);
          setIsSuperAdmin(loggedInUser.role === 'superadmin');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch email count
    const fetchEmailCount = async () => {
      try {
        const response = await axios.get('/api/emails/count');
        const currentEmailCount = response.data.count;
        const lastViewedEmailCount = parseInt(localStorage.getItem('lastViewedEmailCount'), 10) || 0;
        const newEmails = currentEmailCount - lastViewedEmailCount;

        if (newEmails > 0) {
          setNewEmailCount(newEmails);
        } else {
          setNewEmailCount(0);
        }
      } catch (error) {
        console.error('Error fetching email count:', error);
      }
    };

    fetchEmailCount();
    const interval = setInterval(fetchEmailCount, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  const handleMarkAllAsViewed = async () => {
    try {
      await axios.post('/api/emails/mark-all-as-viewed');
      setNewEmailCount(0);
    } catch (error) {
      console.error('Error marking emails as viewed:', error);
    }
  };

  const logout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <header className='header'>
      <div className='header-left'>
        <BsSearch className='icon' />
      </div>
      <div className='header-right'>
        <div
          className='notification-container'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className='person-icon-container'>
            <BsPersonCircle className='icon' />
            {newEmailCount > 0 && (
              <Badge bg='danger' className='person-icon-badge'>
                {newEmailCount}
              </Badge>
            )}
          </div>
          {showDropdown && (
           <div className='notification-dropdown'>
           <div className='notification-content'>
             <div className='user-info-container'>
               <BsEnvelope className='email-icon' />
               <div className='user-email'>{userEmail}</div>
             </div>
             <hr className='bottom-border' />
             <Link to="/alerts" style={{ textDecoration: "none", color: "#333" }}>
               <div className='notification-item'>
                 <div className='notification-icon-container'>
                   <BsFillBellFill className='notification-icon' />
                   {newEmailCount > 0 && (
                     <Badge bg='danger' className='notification-badge'>
                       {newEmailCount}
                     </Badge>
                   )}
                 </div>
                 <span className='notification-text'>New Notifications</span>
               </div>
             </Link>
             <button className='logout-button' onClick={logout}>
               <BsBoxArrowRight className='logout-icon m-1' />
               <span className='logout-text'>Logout</span>
             </button>
           </div>
         </div>
         
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
