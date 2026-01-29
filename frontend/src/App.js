import React, { useState, useEffect } from 'react';
import ReminderList from './components/ReminderList';
import ReminderForm from './components/ReminderForm';
import { reminderService } from './services/api';
import { requestNotificationPermission, checkUpcomingReminders } from './utils/notifications';
import './App.css';

function App() {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReminders();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    // Check for upcoming reminders every minute
    const intervalId = setInterval(() => {
      checkUpcomingReminders(reminders);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [reminders]);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await reminderService.getAllReminders();
      setReminders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load reminders. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReminder = async (formData) => {
    try {
      await reminderService.createReminder(formData);
      await loadReminders();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create reminder');
      console.error(err);
    }
  };

  const handleUpdateReminder = async (formData) => {
    try {
      await reminderService.updateReminder(editingReminder._id, formData);
      await loadReminders();
      setEditingReminder(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to update reminder');
      console.error(err);
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await reminderService.deleteReminder(id);
        await loadReminders();
        setError(null);
      } catch (err) {
        setError('Failed to delete reminder');
        console.error(err);
      }
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await reminderService.updateReminder(id, { completed });
      await loadReminders();
      setError(null);
    } catch (err) {
      setError('Failed to update reminder');
      console.error(err);
    }
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingReminder(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📝 Reminder App</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-add">
            + Add Reminder
          </button>
        )}
      </header>

      <main className="app-main">
        {error && <div className="error-message">{error}</div>}

        {showForm ? (
          <ReminderForm
            onSubmit={editingReminder ? handleUpdateReminder : handleCreateReminder}
            onCancel={handleCancelForm}
            initialData={editingReminder}
          />
        ) : loading ? (
          <div className="loading">Loading reminders...</div>
        ) : (
          <ReminderList
            reminders={reminders}
            onEdit={handleEdit}
            onDelete={handleDeleteReminder}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </main>
    </div>
  );
}

export default App;
