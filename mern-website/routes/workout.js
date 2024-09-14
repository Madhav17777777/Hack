// routes/workout.js
const express = require('express');
const router = express.Router();
const openai = require('openai'); // Assuming you're using OpenAI

router.post('/generate-workout', async (req, res) => {
  const { prompt } = req.body;
  try {
    const workoutPlan = await openai.generateWorkout(prompt); // Your OpenAI logic here
    res.json(workoutPlan);
  } catch (error) {
    res.status(500).json({ error: 'Error generating workout plan' });
  }
});

module.exports = router;
