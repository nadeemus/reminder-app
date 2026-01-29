const mongoose = require('mongoose');

// Custom validator for location - ensure all fields present or none
const locationValidator = function(location) {
  if (!location) return true;
  
  const hasName = location.name && location.name.trim().length > 0;
  const hasLat = location.latitude !== undefined && location.latitude !== null;
  const hasLon = location.longitude !== undefined && location.longitude !== null;
  
  // Either all required fields present or none
  if (hasName || hasLat || hasLon) {
    return hasName && hasLat && hasLon;
  }
  
  return true;
};

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  completed: {
    type: Boolean,
    default: false
  },
  notified: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  location: {
    name: {
      type: String,
      trim: true,
      maxlength: [200, 'Location name cannot be more than 200 characters']
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    },
    radius: {
      type: Number,
      default: 100,
      min: 10,
      max: 5000
    },
    validate: {
      validator: locationValidator,
      message: 'Location must include name, latitude, and longitude, or be empty'
    }
  },
  locationNotified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reminder', reminderSchema);
