import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f59e0b',
    },
    background: {
      default: '#0c0c14',
      paper: '#13131f',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
