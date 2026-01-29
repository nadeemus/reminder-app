export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }
};

export const checkUpcomingReminders = (reminders) => {
  const now = new Date();
  
  reminders.forEach((reminder) => {
    if (reminder.completed) return;
    
    const dueDate = new Date(reminder.dueDate);
    const timeDiff = dueDate - now;
    const minutesDiff = Math.floor(timeDiff / 60000);

    // Notify if reminder is due within 5 minutes and hasn't been notified
    if (minutesDiff >= 0 && minutesDiff <= 5 && !reminder.notified) {
      showNotification(`Reminder: ${reminder.title}`, {
        body: reminder.description || `Due at ${dueDate.toLocaleString()}`,
        tag: reminder._id,
      });
    }
  });
};
