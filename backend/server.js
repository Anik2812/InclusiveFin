const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Define schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  financialProfile: {
    income: Number,
    expenses: Number,
    savings: Number,
    creditHistory: [String],
  },
});

const EducationResourceSchema = new mongoose.Schema({
  title: String,
  content: String,
  language: String,
  category: String,
});

const LendingCircleSchema = new mongoose.Schema({
  name: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalAmount: Number,
  contributionAmount: Number,
  duration: Number,
  status: String,
});

const MicrograntSchema = new mongoose.Schema({
  businessName: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  amountRequested: Number,
  status: String,
});

const FinancialGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  targetAmount: Number,
  currentAmount: Number,
  deadline: Date,
  category: String,
});

// Create models
const User = mongoose.model('User', UserSchema);
const EducationResource = mongoose.model('EducationResource', EducationResourceSchema);
const LendingCircle = mongoose.model('LendingCircle', LendingCircleSchema);
const Microgrant = mongoose.model('Microgrant', MicrograntSchema);
const FinancialGoal = mongoose.model('FinancialGoal', FinancialGoalSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/auth/check', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// User routes
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Education resource routes
app.get('/api/education', async (req, res) => {
  try {
    const resources = await EducationResource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/education', authenticateToken, async (req, res) => {
  try {
    const resource = new EducationResource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lending circle routes
app.get('/api/lending-circles', authenticateToken, async (req, res) => {
  try {
    const circles = await LendingCircle.find().populate('members', 'name email');
    res.json(circles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/lending-circles', authenticateToken, async (req, res) => {
  try {
    const circle = new LendingCircle(req.body);
    await circle.save();
    io.emit('newLendingCircle', circle);
    res.status(201).json(circle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/lending-circles/:id', authenticateToken, async (req, res) => {
  try {
    const circle = await LendingCircle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit('updatedLendingCircle', circle);
    res.json(circle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Microgrant routes
app.get('/api/microgrants', authenticateToken, async (req, res) => {
  try {
    const grants = await Microgrant.find().populate('owner', 'name');
    res.json(grants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/microgrants', authenticateToken, async (req, res) => {
  try {
    const grant = new Microgrant({ ...req.body, owner: req.user.id });
    await grant.save();
    res.status(201).json(grant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Financial goal routes
app.get('/api/financial-goals/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to access these goals' });
    }
    const goals = await FinancialGoal.find({ user: req.params.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/financial-goals', authenticateToken, async (req, res) => {
  try {
    const goal = new FinancialGoal({ ...req.body, user: req.user.id });
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/financial-goals/:id', authenticateToken, async (req, res) => {
  try {
    const goal = await FinancialGoal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (goal.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }
    const updatedGoal = await FinancialGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Credit score route
app.post('/api/credit-score', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const creditScore = calculateInclusiveCreditScore(user.financialProfile);
    res.json({ creditScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function calculateInclusiveCreditScore(financialProfile) {
  const { income, expenses, savings, creditHistory } = financialProfile;
  let score = 300;

  score += Math.min(income / 1000, 100);

  const savingsRate = savings / income;
  score += savingsRate * 100;

  const expenseRatio = expenses / income;
  score -= expenseRatio * 50;

  score += creditHistory.length * 10;

  return Math.max(300, Math.min(Math.round(score), 850));
}

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});