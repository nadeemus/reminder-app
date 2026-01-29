import React from 'react';
import './ReminderList.css';

const ReminderList = ({ reminders, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isPastDue = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  if (reminders.length === 0) {
    return (
      <div className="empty-state">
        <p>No reminders yet. Create your first reminder!</p>
      </div>
    );
  }

  return (
    <div className="reminder-list">
      {reminders.map((reminder) => (
        <div
          key={reminder._id}
          className={`reminder-card ${reminder.completed ? 'completed' : ''} ${
            isPastDue(reminder.dueDate) && !reminder.completed ? 'past-due' : ''
          }`}
        >
          <div className="reminder-header">
            <div className="reminder-title-section">
              <input
                type="checkbox"
                checked={reminder.completed}
                onChange={() => onToggleComplete(reminder._id, !reminder.completed)}
                className="checkbox"
              />
              <h3 className="reminder-title">{reminder.title}</h3>
            </div>
            <span className={`priority-badge ${getPriorityClass(reminder.priority)}`}>
              {reminder.priority}
            </span>
          </div>

          {reminder.description && (
            <p className="reminder-description">{reminder.description}</p>
          )}

          <div className="reminder-footer">
            <div className="reminder-date">
              <span className="date-label">Due:</span>
              <span className={isPastDue(reminder.dueDate) && !reminder.completed ? 'date-overdue' : ''}>
                {formatDate(reminder.dueDate)}
              </span>
            </div>

            <div className="reminder-actions">
              <button onClick={() => onEdit(reminder)} className="btn-edit">
                Edit
              </button>
              <button onClick={() => onDelete(reminder._id)} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReminderList;
