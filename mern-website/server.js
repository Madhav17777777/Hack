require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT =process.env.PORT||5000 ;

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the header

  console.log("Token Received:", token); // Debugging line

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Failed to authenticate token" });
    req.user = user; // Attach the decoded user data to the request
    next();
  });
};

// Middleware setup
app.use(
  cors({
    origin: ["https://mern-website-1whq.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Signup route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to register user", details: err.message });
  }
});

// Login route
// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token }); // Ensure token is being sent in response
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});


// Protected route to verify token validity
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted to protected route", userId: req.user.userId });
});

// AI content generation route
app.post("/generate-workout", authenticateToken, async (req, res) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).send("API_KEY environment variable not set");
  }

  const userPrompt = req.body.prompt;

  if (!userPrompt) {
    return res.status(400).send("Prompt is required");
  }

  // Default instruction for generating a workout plan in JSON format
  const formatInstruction = "Generate a JSON response for a weekly workout plan. Each day should have an array of exercises, and each exercise should contain the following keys: name: The name of the exercise as a string. sets: Number of sets as an integer. reps: Number of reps as a string (it can be a range like '8-12' or a specific value). rest: Rest time between sets in seconds as an integer. Include rest days with no exercises. Don't put any extra text, just give JSON.";
  // Combine user prompt with the default instruction
  const combinedPrompt = `${userPrompt}. ${formatInstruction}`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(combinedPrompt);
    let responseText = result.response.text();

    // Remove any extra formatting like code blocks, if present
    responseText = responseText.replace(/```json|```/g, "").trim();
    const jsonResponse = JSON.parse(responseText);
    res.json(jsonResponse);
  } catch (err) {
    console.error("Error generating content:", err);
    res.status(500).send("Failed to generate content from the AI model.");
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
