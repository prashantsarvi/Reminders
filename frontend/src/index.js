import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App.js';
import axios from 'axios';
import "react-datetime/css/react-datetime.css";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);