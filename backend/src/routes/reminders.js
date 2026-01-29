const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// @route   GET /api/reminders
// @desc    Get all reminders
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ dueDate: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reminders/:id
// @desc    Get a single reminder
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/reminders
// @desc    Create a new reminder
// @access  Public
router.post('/', async (req, res) => {
  try {
    const reminder = new Reminder({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority || 'medium'
    });

    const newReminder = await reminder.save();
    res.status(201).json(newReminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/reminders/:id
// @desc    Update a reminder
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (req.body.title !== undefined) reminder.title = req.body.title;
    if (req.body.description !== undefined) reminder.description = req.body.description;
    if (req.body.dueDate !== undefined) reminder.dueDate = req.body.dueDate;
    if (req.body.completed !== undefined) reminder.completed = req.body.completed;
    if (req.body.priority !== undefined) reminder.priority = req.body.priority;

    const updatedReminder = await reminder.save();
    res.json(updatedReminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    await reminder.deleteOne();
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
