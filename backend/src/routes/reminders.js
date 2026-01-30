const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { checkLocationReminders } = require('../services/locationService');
const { protect } = require('../middleware/auth');

// @route   GET /api/reminders
// @desc    Get all reminders for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reminders/:id
// @desc    Get a single reminder
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    // Check if reminder belongs to user
    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this reminder' });
    }
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/reminders
// @desc    Create a new reminder
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const reminderData = {
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority || 'medium'
    };

    // Add location data if provided
    if (req.body.location) {
      const { name, latitude, longitude, radius } = req.body.location;
      
      // Validate that all required location fields are present
      if (!name || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ 
          message: 'Location must include name, latitude, and longitude' 
        });
      }

      // Validate latitude and longitude ranges
      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        return res.status(400).json({ 
          message: 'Latitude must be a number between -90 and 90' 
        });
      }

      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        return res.status(400).json({ 
          message: 'Longitude must be a number between -180 and 180' 
        });
      }

      // Validate radius if provided
      const locationRadius = radius || 100;
      if (isNaN(locationRadius) || locationRadius < 10 || locationRadius > 5000) {
        return res.status(400).json({ 
          message: 'Radius must be a number between 10 and 5000 meters' 
        });
      }

      reminderData.location = {
        name: name.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseInt(locationRadius)
      };
    }

    const reminder = new Reminder(reminderData);
    const newReminder = await reminder.save();
    res.status(201).json(newReminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/reminders/:id
// @desc    Update a reminder
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    // Check if reminder belongs to user
    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this reminder' });
    }

    if (req.body.title !== undefined) reminder.title = req.body.title;
    if (req.body.description !== undefined) reminder.description = req.body.description;
    if (req.body.dueDate !== undefined) reminder.dueDate = req.body.dueDate;
    if (req.body.completed !== undefined) reminder.completed = req.body.completed;
    if (req.body.priority !== undefined) reminder.priority = req.body.priority;
    if (req.body.location !== undefined) {
      // If location is null or empty object, clear location data
      if (req.body.location === null || Object.keys(req.body.location).length === 0) {
        reminder.location = undefined;
      } else {
        // Validate location data
        const { name, latitude, longitude, radius } = req.body.location;
        
        if (!name || latitude === undefined || longitude === undefined) {
          return res.status(400).json({ 
            message: 'Location must include name, latitude, and longitude' 
          });
        }

        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
          return res.status(400).json({ 
            message: 'Latitude must be a number between -90 and 90' 
          });
        }

        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
          return res.status(400).json({ 
            message: 'Longitude must be a number between -180 and 180' 
          });
        }

        const locationRadius = radius || 100;
        if (isNaN(locationRadius) || locationRadius < 10 || locationRadius > 5000) {
          return res.status(400).json({ 
            message: 'Radius must be a number between 10 and 5000 meters' 
          });
        }

        reminder.location = {
          name: name.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          radius: parseInt(locationRadius)
        };
      }
    }

    const updatedReminder = await reminder.save();
    res.json(updatedReminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    // Check if reminder belongs to user
    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this reminder' });
    }

    await reminder.deleteOne();
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/reminders/check-location
// @desc    Check for location-based reminders
// @access  Private
router.post('/check-location', protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Validate latitude and longitude
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({ 
        message: 'Latitude must be a number between -90 and 90' 
      });
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
      return res.status(400).json({ 
        message: 'Longitude must be a number between -180 and 180' 
      });
    }

    const triggeredReminders = await checkLocationReminders(lat, lon, req.user._id);
    res.json({ reminders: triggeredReminders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
