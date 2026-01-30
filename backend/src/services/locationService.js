const Reminder = require('../models/Reminder');

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Check if user is within range of any location-based reminders
const checkLocationReminders = async (userLat, userLon) => {
  try {
    // Find all location-based reminders that haven't been notified
    const reminders = await Reminder.find({
      'location.latitude': { $exists: true },
      'location.longitude': { $exists: true },
      locationNotified: false,
      completed: false
    });

    const triggeredReminders = [];

    for (const reminder of reminders) {
      const distance = calculateDistance(
        userLat,
        userLon,
        reminder.location.latitude,
        reminder.location.longitude
      );

      const radius = reminder.location.radius || 100;

      if (distance <= radius) {
        console.log(`[LOCATION NOTIFICATION] User is near: ${reminder.location.name || reminder.title}`);
        console.log(`  Distance: ${Math.round(distance)}m, Radius: ${radius}m`);
        
        // Mark as notified
        reminder.locationNotified = true;
        await reminder.save();
        
        triggeredReminders.push({
          _id: reminder._id,
          title: reminder.title,
          description: reminder.description,
          locationName: reminder.location.name,
          distance: Math.round(distance)
        });
      }
    }

    return triggeredReminders;
  } catch (error) {
    console.error('Error checking location reminders:', error);
    return [];
  }
};

module.exports = { calculateDistance, checkLocationReminders };
