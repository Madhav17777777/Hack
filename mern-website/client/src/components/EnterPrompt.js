import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EnterPrompt = ({ onLogout }) => { // Receive onLogout as a prop
  const [prompt, setPrompt] = useState('');
  const [workout, setWorkout] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerateWorkout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/generate-workout', { prompt }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWorkout(response.data);
      setError('');
    } catch (err) {
      if (err.response) {
        setError(`Failed to generate workout. Error: ${err.response.data}`);
      } else if (err.request) {
        setError('Failed to generate workout. No response from server.');
      } else {
        setError(`Failed to generate workout. Error: ${err.message}`);
      }
    }
  };

  const handleReset = () => {
    setPrompt('');
    setWorkout({});
    setError('');
  };

  const handleLogout = () => {
    onLogout(); // Call the onLogout prop to handle logout in the parent component
    navigate('/login'); // Redirect to login page
  };

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <div className='enter-prompt-page'>
      <div className="enter-prompt-container">
        <h2>Enter Your Workout Request</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleGenerateWorkout}>
          <textarea
            placeholder="Describe your workout needs (e.g., 'I want a beginner-level workout plan')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
          <div className="button-group">
            <button type="submit">Generate Workout</button>
            <button type="button" onClick={handleReset}>Reset</button>
          </div>
        </form>

        {workout && Object.keys(workout).length > 0 && (
          <div className="workout-plan">
            <h3>Your Workout Plan:</h3>
            <div className="workout-cards">
              {Object.entries(workout).map(([day, exercises], index) => (
                <div className="workout-card" key={index}>
                  <h4>{day}</h4>
                  {Array.isArray(exercises) && exercises.length > 0 ? (
                    exercises.map((exercise, idx) => (
                      <div className="exercise-details" key={idx}>
                        <p><strong>{exercise.name}</strong></p>
                        <p>Sets: {exercise.sets}</p>
                        <p>Reps: {exercise.reps}</p>
                        <p>Rest: {exercise.rest} sec</p>
                      </div>
                    ))
                  ) : (
                    <p>No exercises available for {day}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className="footer">
        <button onClick={handleHome} className="home-button">
          Home
        </button>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </footer>
    </div>
  );
};

export default EnterPrompt;
