import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import EnterPrompt from './components/EnterPrompt';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get('http://localhost:5000/protected', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Update authentication status after login
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false); // Update authentication status after logout
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/enter-prompt" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/enter-prompt" /> : <Signup />} />
        <Route path="/enter-prompt" element={isAuthenticated ? <EnterPrompt onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/home" element={<Dashboard isAuthenticated={isAuthenticated} />} />
      </Routes>
    </Router>
  );
};

export default App;
