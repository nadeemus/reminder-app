const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const reminderService = {
  // Get all reminders
  getAllReminders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch reminders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }
  },

  // Get single reminder
  getReminder: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch reminder');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reminder:', error);
      throw error;
    }
  },

  // Create reminder
  createReminder: async (reminderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reminderData),
      });
      if (!response.ok) throw new Error('Failed to create reminder');
      return await response.json();
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  },

  // Update reminder
  updateReminder: async (id, reminderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(reminderData),
      });
      if (!response.ok) throw new Error('Failed to update reminder');
      return await response.json();
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  },

  // Delete reminder
  deleteReminder: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete reminder');
      return await response.json();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  },

  // Check location-based reminders
  checkLocationReminders: async (latitude, longitude) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/check-location`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ latitude, longitude }),
      });
      if (!response.ok) throw new Error('Failed to check location reminders');
      return await response.json();
    } catch (error) {
      console.error('Error checking location reminders:', error);
      throw error;
    }
  },
};

export default reminderService;
