import React, { useEffect, useState } from 'react';
import { BsCart3, BsGrid1X2Fill, BsPeopleFill, BsShieldCheck, BsPersonFill} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { MdLocationCity } from 'react-icons/md';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
    }
  }, []);

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <MdLocationCity className='icon_header' /> 17 Columns
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/dashboard">
            <BsGrid1X2Fill className='icon' /> Dashboard
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/customers">
            <BsPeopleFill className='icon' /> Customers
          </Link>
        </li>
        {userRole === 'superadmin' && (
          <li className='sidebar-list-item'>
            <Link to="/access">
              <BsShieldCheck className='icon' /> Access
            </Link>
          </li>
        )}
        {userRole === 'superadmin' && (
        <li className='sidebar-list-item'>
          <Link to="/user-management">
            <BsPersonFill className='icon' /> Users
          </Link>
        </li>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
