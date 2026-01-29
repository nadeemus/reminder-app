# Testing Guide for Reminder App

This document provides comprehensive testing instructions for the Reminder App.

## Prerequisites

Before testing, ensure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ MongoDB installed and running
- ✅ Backend dependencies installed (`cd backend && npm install`)
- ✅ Frontend dependencies installed (`cd frontend && npm install`)

## Backend Testing

### 1. Start MongoDB

First, ensure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux with systemd
sudo systemctl start mongod

# Verify MongoDB is running
mongo --eval "db.stats()"
```

### 2. Start Backend Server

```bash
cd backend
npm start
# or for development mode with auto-reload:
npm run dev
```

Expected output:
```
Server is running on port 5000
MongoDB Connected: localhost
Notification scheduler started
```

### 3. Test API Endpoints

You can test the API using curl, Postman, or any HTTP client:

#### Test Health Check
```bash
curl http://localhost:5000/
# Expected: {"message":"Welcome to Reminder App API"}
```

#### Create a Reminder
```bash
curl -X POST http://localhost:5000/api/reminders \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Reminder",
    "description": "This is a test",
    "dueDate": "2024-02-01T14:00:00",
    "priority": "high"
  }'
```

#### Get All Reminders
```bash
curl http://localhost:5000/api/reminders
```

#### Get Single Reminder
```bash
curl http://localhost:5000/api/reminders/{REMINDER_ID}
```

#### Update a Reminder
```bash
curl -X PUT http://localhost:5000/api/reminders/{REMINDER_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

#### Delete a Reminder
```bash
curl -X DELETE http://localhost:5000/api/reminders/{REMINDER_ID}
```

### 4. Test Cron Service

The cron service runs every minute to check for upcoming reminders:

1. Create a reminder with a due date 2-5 minutes in the future
2. Watch the server console logs
3. You should see a notification log when the reminder is approaching

Expected log output:
```
[NOTIFICATION] Reminder due soon: Test Reminder at Wed Jan 31 2024 14:00:00 GMT-0500
```

## Frontend Testing

### 1. Start Frontend Development Server

Make sure the backend is running first, then:

```bash
cd frontend
npm start
```

The app should open in your browser at `http://localhost:3000`

### 2. Manual Testing Checklist

#### Initial Load
- [ ] Page loads without errors
- [ ] Browser asks for notification permission
- [ ] Header displays "📝 Reminder App"
- [ ] "+ Add Reminder" button is visible
- [ ] Empty state message shows if no reminders exist

#### Create Reminder
- [ ] Click "+ Add Reminder" button
- [ ] Form appears with all fields
- [ ] Fill in title (required)
- [ ] Fill in description (optional)
- [ ] Select a due date and time
- [ ] Choose priority level (Low/Medium/High)
- [ ] Click "Create Reminder"
- [ ] Form closes and new reminder appears in list
- [ ] Reminder displays with correct priority badge color

#### View Reminders
- [ ] Reminders are displayed as cards
- [ ] Each card shows title, description, due date, priority
- [ ] Priority badges are color-coded (Blue=Low, Orange=Medium, Red=High)
- [ ] Past due reminders have red left border
- [ ] Completed reminders appear grayed out with strikethrough

#### Edit Reminder
- [ ] Click "Edit" button on a reminder
- [ ] Form appears pre-filled with existing data
- [ ] Modify any field
- [ ] Click "Update Reminder"
- [ ] Changes are saved and displayed
- [ ] Click "Cancel" to close form without saving

#### Complete Reminder
- [ ] Click checkbox next to reminder title
- [ ] Reminder appears completed (grayed out, strikethrough)
- [ ] Click checkbox again to mark as incomplete

#### Delete Reminder
- [ ] Click "Delete" button
- [ ] Confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Reminder is removed from list

#### Browser Notifications
- [ ] Create a reminder with due date 2-5 minutes in the future
- [ ] Wait for the time to approach
- [ ] Browser notification should appear
- [ ] Notification shows reminder title and description

#### Responsive Design
Test on different screen sizes:
- [ ] Desktop (1920x1080): Cards display in grid
- [ ] Tablet (768x1024): Layout adjusts appropriately
- [ ] Mobile (375x667): Single column layout, buttons stack vertically

### 3. Error Handling

#### Backend Not Running
- [ ] Stop backend server
- [ ] Refresh frontend
- [ ] Error message displays: "Failed to load reminders. Make sure the backend server is running."

#### Network Error Simulation
- [ ] Disconnect from network
- [ ] Try to create/update/delete a reminder
- [ ] Appropriate error message displays

#### Invalid Data
- [ ] Try to submit form without required fields
- [ ] HTML5 validation prevents submission
- [ ] All required fields are marked with *

## Integration Testing

### End-to-End Test Flow

1. **Setup**
   - Start MongoDB
   - Start backend server
   - Start frontend app
   - Allow browser notifications

2. **Create Multiple Reminders**
   ```
   Reminder 1: "Morning Meeting" - Due in 10 minutes - High Priority
   Reminder 2: "Lunch Break" - Due in 2 hours - Medium Priority
   Reminder 3: "Code Review" - Due tomorrow - Low Priority
   ```

3. **Test CRUD Operations**
   - Edit "Morning Meeting" to change time
   - Mark "Lunch Break" as completed
   - Delete "Code Review"
   - Create a new reminder

4. **Test Notifications**
   - Create a reminder due in 3 minutes
   - Wait for notification to appear
   - Verify notification shows correct info

5. **Test Responsive Layout**
   - Resize browser window
   - Check layout at different breakpoints
   - Test on mobile device if available

## Performance Testing

### Load Testing
- Create 50+ reminders
- Verify app remains responsive
- Check loading times

### Memory Testing
- Monitor browser memory usage
- Let app run with notification checker for extended period
- Verify no memory leaks

## Browser Compatibility

Test on multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Known Issues & Limitations

1. **MongoDB Dependency**: Backend requires MongoDB to be running
2. **Browser Notifications**: Require user permission and HTTPS in production
3. **Time Zone**: Dates/times are shown in local timezone
4. **Concurrent Updates**: No real-time sync between multiple clients

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongo --eval "db.stats()"`
- Check port 5000 is available: `lsof -i :5000`
- Verify .env file exists and is configured correctly

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env
- Check browser console for CORS errors

### Notifications not working
- Ensure browser notifications are allowed
- Check browser notification settings
- Desktop notifications may need system permissions

## Success Criteria

The application passes testing if:
- ✅ All API endpoints work correctly
- ✅ All CRUD operations function properly
- ✅ Browser notifications appear for upcoming reminders
- ✅ UI is responsive on mobile, tablet, and desktop
- ✅ Error handling works gracefully
- ✅ Cron job logs notifications correctly
- ✅ No console errors during normal operation
