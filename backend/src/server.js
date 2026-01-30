const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const reminderRoutes = require('./routes/reminders');
const authRoutes = require('./routes/auth');
const { scheduleNotifications } = require('./services/cronService');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Reminder App API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);

// Start cron service for notifications
scheduleNotifications();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
