# 🚀 Quick Start Guide

Get the Reminder App running in under 5 minutes!

## Prerequisites

- Node.js v14+ installed
- MongoDB installed and running
- Terminal/Command prompt

## Installation Steps

### 1️⃣ Clone & Verify

```bash
# Clone the repository
git clone https://github.com/nadeemus/reminder-app.git
cd reminder-app

# Run verification script
chmod +x verify-setup.sh
./verify-setup.sh
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the backend server
npm start
```

✅ You should see:
```
Server is running on port 5000
MongoDB Connected: localhost
Notification scheduler started
```

### 3️⃣ Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

✅ Your browser should automatically open to `http://localhost:3000`

### 4️⃣ Start Using!

1. **Allow notifications** when prompted by your browser
2. Click **"+ Add Reminder"**
3. Fill in the form:
   - Title: "Test Reminder"
   - Description: "My first reminder"
   - Due Date: 5 minutes from now
   - Priority: High
4. Click **"Create Reminder"**
5. Watch for the notification!

## Troubleshooting

### ❌ Backend won't start

**Problem**: `MongoNetworkError: connect ECONNREFUSED`

**Solution**: Make sure MongoDB is running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB from Services or run mongod.exe
```

### ❌ Frontend can't connect to backend

**Problem**: Network error or CORS issue

**Solution**: 
- Make sure backend is running on port 5000
- Check that frontend `.env` has `REACT_APP_API_URL=http://localhost:5000/api`

### ❌ Notifications not appearing

**Problem**: No browser notifications

**Solution**:
- Check browser notification permissions
- Make sure you clicked "Allow" when prompted
- Check browser settings: `chrome://settings/content/notifications`

### ❌ Port already in use

**Problem**: `Port 5000 is already in use`

**Solution**: Change the port in `backend/.env`
```
PORT=5001
```

And update `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5001/api
```

## Using Docker (Optional)

Coming soon! Docker support will make setup even easier.

## Next Steps

📖 Read the full [README.md](README.md) for detailed information

🏗️ Check out [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design

🧪 See [TESTING.md](TESTING.md) for comprehensive testing procedures

## Getting Help

- Check the [Issues](https://github.com/nadeemus/reminder-app/issues) page
- Review the troubleshooting section above
- Consult the documentation files

## Common Tasks

### Add a new reminder
```
1. Click "+ Add Reminder"
2. Fill in the form
3. Click "Create Reminder"
```

### Edit a reminder
```
1. Click "Edit" on any reminder card
2. Modify the fields
3. Click "Update Reminder"
```

### Mark as complete
```
1. Click the checkbox next to the reminder title
2. Reminder will show as completed (grayed out)
```

### Delete a reminder
```
1. Click "Delete" on any reminder card
2. Confirm the deletion
```

---

**Enjoy using the Reminder App! 📝✨**
