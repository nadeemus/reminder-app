import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AuthCallback from './components/AuthCallback';
import ReminderList from './components/ReminderList';
import ReminderForm from './components/ReminderForm';
import { reminderService } from './services/api';
import { requestNotificationPermission, checkUpcomingReminders } from './utils/notifications';
import { startLocationTracking, stopLocationTracking } from './services/geolocation';
import './App.css';

function MainApp() {
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadReminders();
      requestNotificationPermission();
      
      // Start location tracking for location-based reminders
      const handleLocationNotification = (reminders) => {
        // Refresh reminder list after location notifications
        loadReminders();
      };
      
      startLocationTracking(handleLocationNotification);
      
      // Cleanup on unmount
      return () => {
        stopLocationTracking();
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      // Check for upcoming reminders every minute
      const intervalId = setInterval(() => {
        checkUpcomingReminders(reminders);
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [reminders, isAuthenticated]);

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

  const handleLogout = () => {
    logout();
    setReminders([]);
    setShowForm(false);
    setEditingReminder(null);
  };

  if (authLoading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div>
          <h1>📝 Reminder App</h1>
          {user && <p className="user-info">Welcome, {user.name}!</p>}
        </div>
        <div className="header-actions">
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-add">
              + Add Reminder
            </button>
          )}
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
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

function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return showLogin ? (
    <Login onSwitchToRegister={() => setShowLogin(false)} />
  ) : (
    <Register onSwitchToLogin={() => setShowLogin(true)} />
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<MainApp />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
