const cron = require('node-cron');
const Reminder = require('../models/Reminder');

// Run every minute to check for upcoming reminders
const scheduleNotifications = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

      // Find reminders due in the next 5 minutes that haven't been notified
      const reminders = await Reminder.find({
        dueDate: { $lte: fiveMinutesFromNow, $gte: now },
        notified: false,
        completed: false
      });

      reminders.forEach(async (reminder) => {
        console.log(`[NOTIFICATION] Reminder due soon: ${reminder.title} at ${reminder.dueDate}`);
        
        // Mark as notified
        reminder.notified = true;
        await reminder.save();
      });
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });

  console.log('Notification scheduler started');
};

module.exports = { scheduleNotifications };
