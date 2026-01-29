const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const reminderService = {
  // Get all reminders
  getAllReminders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders`);
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
      const response = await fetch(`${API_BASE_URL}/reminders/${id}`);
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      });
      if (!response.ok) throw new Error('Failed to delete reminder');
      return await response.json();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  },
};
