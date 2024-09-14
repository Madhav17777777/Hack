import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const fitnessTexts = [
  "Physical Fitness",
  "Mental Strength",
  "Endurance Training",
  "Muscle Building",
  "Flexibility"
];

const Dashboard = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % fitnessTexts.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleEnterPrompt = () => {
    navigate('/enter-prompt');
  };

  return (
    <div className="dashboard">
      <video autoPlay loop muted className="background-video">
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <header>
        <div className="logo"><h1>REAL ONES</h1></div>
        <div className="auth-buttons">
          <a href='/login' className="auth-link">Login</a>
          <a href='/signup' className="auth-link">Signup</a>
          <button className="join-us" onClick={handleEnterPrompt}>Create Your Plan</button>
        </div>
      </header>
      <main>
        <div className="content">
          <h1>Build Your Dream Physique</h1>
          <h2 className="animated-text">{fitnessTexts[currentTextIndex]}</h2>
          <button onClick={handleSignup} className="join-us">Join US</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;