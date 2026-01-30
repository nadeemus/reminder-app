import api from './api';

let watchId = null;
let lastCheckTime = 0;
const CHECK_INTERVAL = 60000; // Check every 60 seconds

// Request permission and start watching location
export const startLocationTracking = async (onLocationUpdate) => {
  if (!navigator.geolocation) {
    console.warn('Geolocation is not supported by this browser.');
    return false;
  }

  try {
    // Request notification permission if not already granted
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    // Check geolocation permission
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    
    if (permissionStatus.state === 'denied') {
      console.warn('Geolocation permission denied');
      return false;
    }

    if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationUpdate(latitude, longitude, onLocationUpdate);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Stop watching location
export const stopLocationTracking = () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
};

// Handle location updates
const handleLocationUpdate = async (latitude, longitude, onLocationUpdate) => {
  const now = Date.now();
  
  // Throttle checks to avoid too many API calls
  if (now - lastCheckTime < CHECK_INTERVAL) {
    return;
  }

  lastCheckTime = now;

  try {
    const response = await api.checkLocationReminders(latitude, longitude);
    
    if (response.reminders && response.reminders.length > 0) {
      response.reminders.forEach((reminder) => {
        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification(`📍 ${reminder.title}`, {
            body: reminder.locationName 
              ? `You're near ${reminder.locationName}! ${reminder.description || ''}`
              : `You're at your reminder location! ${reminder.description || ''}`,
            icon: '/favicon.ico',
            tag: `location-${reminder._id}`,
          });
        }
      });

      // Call callback if provided
      if (onLocationUpdate) {
        onLocationUpdate(response.reminders);
      }
    }
  } catch (error) {
    console.error('Error checking location reminders:', error);
  }
};

// Get current position once
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};
