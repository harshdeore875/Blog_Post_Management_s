import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';
import { theme } from './styles/theme.js';
import './styles/global.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
