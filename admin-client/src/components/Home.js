import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import axios from 'axios';
import './Admin.css';
import { setEmailCount } from './actions/action';

function Home() {
  const emailCount = useSelector((state) => state.emailCount);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get('/api/emails/count')
      .then((response) => dispatch(setEmailCount(response.data.count)))
      .catch((error) => console.error('Error fetching email count:', error));
  }, [dispatch]);

  const target = 100;
  const emailChartData = [
    { name: 'Email Count', value: emailCount },
    { name: 'Target', value: target },
  ];

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
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>12</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{emailCount}</h1>
          {/* <p>Target: {target}</p> */}
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h4>ALERTS</h4>
            <BsFillBellFill className='card_icon4' />
          </div>
          <h2>42</h2>
        </div>
      </div>
      <div className='charts'>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            width={500}
            height={300}
            data={emailChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='value' fill={emailCount >= target ? '#82ca9d' : '#8884d8'} />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width='100%' height={300}>
          <LineChart
            width={500}
            height={300}
            data={emailChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='value' stroke={emailCount >= target ? '#82ca9d' : '#8884d8'} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
