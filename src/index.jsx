import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.jsx'; // Updated to import from .jsx file
import './style.css';    // Nếu bạn có file style.css

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
