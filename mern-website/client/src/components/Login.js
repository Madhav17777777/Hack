import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLoginSuccess(); // Notify the parent (App) that login was successful
        navigate('/enter-prompt'); // Redirect after login
      } else {
        setError('No token received from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Type your user name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: 'blue' }}>
            Sign up here
          </span>
        </p>
        <p>
          Return to{' '}
          <span onClick={() => navigate('/home')} style={{ cursor: 'pointer', color: 'blue' }}>
            Home page
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
