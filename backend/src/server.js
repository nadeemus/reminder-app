require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const reminderRoutes = require('./routes/reminders');
const { scheduleNotifications } = require('./services/cronService');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Reminder App API' });
});

app.use('/api/reminders', reminderRoutes);

// Start cron service for notifications
scheduleNotifications();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
