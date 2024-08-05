import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Admin.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Products from './Products';
import Alerts from './Alerts';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar}/>
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
        <Routes>
        {/* <Route path="/signin" element={<Signin />} /> */}
        <Route index element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/alerts" element={<Alerts/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
