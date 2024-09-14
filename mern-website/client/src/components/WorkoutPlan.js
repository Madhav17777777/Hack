// WorkoutPlan.js
import { useLocation } from 'react-router-dom';

const WorkoutPlan = () => {
  const location = useLocation();
  const { workoutPlan } = location.state || {};

  if (!workoutPlan) {
    return <div>No workout plan available.</div>;
  }

  return (
    <div>
      <h1>Your Workout Plan</h1>
      <pre>{JSON.stringify(workoutPlan, null, 2)}</pre>
    </div>
  );
};

export default WorkoutPlan;
