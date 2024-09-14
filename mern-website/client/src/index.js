import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import main App component
import './App.css'; // Import component-specific styles
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
