import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { AdminProvider } from './context/AdminContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AdminProvider>
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  </AdminProvider>

);
