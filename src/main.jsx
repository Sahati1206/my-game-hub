import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// IMPORTANT: This line makes the dark theme and Tailwind utilities load!
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);