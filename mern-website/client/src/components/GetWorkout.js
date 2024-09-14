// client/src/components/GenerateWorkout.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GenerateWorkout = () => {
    const [workoutData, setWorkoutData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorkoutData = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token from local storage
                const response = await axios.get('http://localhost:5000/generate-workout', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWorkoutData(response.data);
            } catch (err) {
                setError('Failed to fetch workout data.');
            }
        };

        fetchWorkoutData();
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Your Workout Plan</h2>
            <pre>{JSON.stringify(workoutData, null, 2)}</pre>
        </div>
    );
};

export default GenerateWorkout;
