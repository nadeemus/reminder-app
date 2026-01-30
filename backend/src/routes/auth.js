const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check for user
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      authProvider: req.user.authProvider
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/google
// @desc    Start Google OAuth
// @access  Public
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`,
    session: true 
  }),
  (req, res) => {
    // Store token in session temporarily for secure transfer
    const token = generateToken(req.user._id);
    req.session.tempToken = token;
    
    // Redirect to frontend callback handler
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendURL}/auth/callback`);
  }
);

// @route   GET /api/auth/apple
// @desc    Start Apple OAuth
// @access  Public
router.get('/apple',
  passport.authenticate('apple')
);

// @route   POST /api/auth/apple/callback
// @desc    Apple OAuth callback
// @access  Public
router.post('/apple/callback',
  passport.authenticate('apple', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`,
    session: true 
  }),
  (req, res) => {
    // Store token in session temporarily for secure transfer
    const token = generateToken(req.user._id);
    req.session.tempToken = token;
    
    // Redirect to frontend callback handler
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendURL}/auth/callback`);
  }
);

// @route   GET /api/auth/session-token
// @desc    Get token from session (used by OAuth callback)
// @access  Public (but requires session)
router.get('/session-token', (req, res) => {
  if (req.session.tempToken) {
    const token = req.session.tempToken;
    // Clear the temp token from session after retrieving
    delete req.session.tempToken;
    res.json({ token });
  } else {
    res.status(404).json({ message: 'No token found in session' });
  }
});

module.exports = router;
