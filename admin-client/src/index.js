import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './store'; // Import your Redux store
// import './components/index.css'
import App from './components/App'; // Your root component
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root'); // Get the root element
const root = createRoot(container); // Create a root

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
