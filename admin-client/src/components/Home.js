import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import axios from 'axios';
import './Admin.css';
import { setEmailCount } from './actions/action';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

function Home() {
  const emailCount = useSelector((state) => state.emailCount);
  const dispatch = useDispatch();
  const [newEmailCount, setNewEmailCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    // Fetch email count
    axios
      .get('/api/emails/count')
      .then((response) => {
        console.log('Email Count Response:', response.data); // Debugging log
        const currentEmailCount = response.data.count;
        const lastViewedEmailCount = parseInt(localStorage.getItem('lastViewedEmailCount'), 10) || 0;
        const newEmails = currentEmailCount - lastViewedEmailCount;

        if (newEmails > 0) {
          setNewEmailCount(newEmails);
        } else {
          setNewEmailCount(0); // Ensure newEmailCount is 0 if there are no new emails
        }

        dispatch(setEmailCount(currentEmailCount));
      })
      .catch((error) => console.error('Error fetching email count:', error));
    
    // Mock data for monthly data
    const mockMonthlyData = [
      { name: 'Jan', open: 20, high: 40, low: 10, close: 30 },
      { name: 'Feb', open: 30, high: 50, low: 20, close: 40 },
      { name: 'Mar', open: 25, high: 35, low: 15, close: 30 },
      { name: 'Apr', open: 35, high: 45, low: 25, close: 40 },
    ];
    setMonthlyData(mockMonthlyData);
    setPieChartData([
      { name: 'Alerts', value: newEmailCount },
      { name: 'Customers', value: emailCount },
    ]);
  }, [dispatch, emailCount, newEmailCount]);

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <main className='main-container'>
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>PRODUCTS</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>0</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CATEGORIES</h3>
            <BsFillGrid3X3GapFill className='card_icon4' />
          </div>
          <h1>0</h1>
        </div>
        <div className='card'>
          <Link to="/products">
            <div className='card-inner'>
              <h3>CUSTOMERS</h3>
              <BsPeopleFill className='card_icon' />
            </div>
            <h1>{emailCount}</h1>
          </Link>
        </div>
        <div className='card'>
          <Link to="/alerts">
            <div className='card-inner'>
              <h4>ALERTS</h4>
              <BsFillBellFill className='card_icon4' />
              {newEmailCount > 0 && (
                <Badge variant="danger" className='badge bg-danger' style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  {newEmailCount}
                </Badge>
              )}
            </div>
            <h2>{newEmailCount}</h2>
          </Link>
        </div>
      </div>
      <div className='charts'>
          <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={monthlyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='high' fill='#82ca9d' />
            <Bar dataKey='low' fill='#8884d8' />
            <Bar dataKey='open' fill='#FF8042' />
            <Bar dataKey='close' fill='#0088FE' />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey='value'
              outerRadius={120}
              fill='#8884d8'
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
