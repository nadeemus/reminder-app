# 📝 Reminder App

A full-stack reminder application built with React.js, Node.js, Express.js, and MongoDB. Features include CRUD operations for reminders, time-based notifications using node-cron, and browser notifications via the Web Notifications API.

## 🚀 Features

- ✅ Create, read, update, and delete reminders
- ⏰ Set due dates and times for reminders
- 🔔 Browser notifications for upcoming reminders
- 📍 **Location-based reminders** - Get notified when you're near a specific location
- 📊 Priority levels (Low, Medium, High)
- ✓ Mark reminders as complete
- 📱 Responsive design for mobile and desktop
- 🎨 Beautiful gradient UI with modern styling

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **node-cron** - Scheduled tasks for notifications
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React.js** - UI library
- **Web Notifications API** - Browser notifications
- **CSS3** - Styling with responsive design
- **Fetch API** - HTTP requests to backend

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/nadeemus/reminder-app.git
cd reminder-app
```

### 2. Backend Setup

#### Install dependencies
```bash
cd backend
npm install
```

#### Configure environment variables
Create a `.env` file in the `backend` directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reminder-app
NODE_ENV=development
```

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux with systemd
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services app
```

#### Run the backend server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

#### Install dependencies
```bash
cd frontend
npm install
```

#### Configure environment variables
The frontend is pre-configured to connect to `http://localhost:5000/api`. If your backend runs on a different port, create a `.env` file:
```
REACT_APP_API_URL=http://localhost:YOUR_PORT/api
```

#### Run the frontend
```bash
npm start
```

The React app will start on `http://localhost:3000`

## 📱 Usage

1. **Allow Notifications**: When you first open the app, allow browser notifications for reminder alerts

2. **Allow Location Access**: For location-based reminders, allow the browser to access your location when prompted

3. **Create a Reminder**:
   - Click the "+ Add Reminder" button
   - Fill in the title, description (optional), due date/time, and priority
   - **For location-based reminders**: Add location name, latitude, longitude, and notification radius
   - Click "Create Reminder"

4. **Manage Reminders**:
   - Check the checkbox to mark a reminder as complete
   - Click "Edit" to modify a reminder
   - Click "Delete" to remove a reminder

5. **Notifications**:
   - **Time-based**: The app checks every minute for reminders due within 5 minutes
   - **Location-based**: The app continuously monitors your location and notifies you when you're within the specified radius of a location
   - You'll receive a browser notification when a reminder is triggered
   - Backend also logs notifications in the server console

## 🏗️ Project Structure

```
reminder-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # MongoDB connection
│   │   ├── models/
│   │   │   └── Reminder.js       # Reminder schema
│   │   ├── routes/
│   │   │   └── reminders.js      # API routes
│   │   ├── services/
│   │   │   └── cronService.js    # Cron job for notifications
│   │   └── server.js             # Express server setup
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ReminderForm.js   # Add/Edit reminder form
│   │   │   ├── ReminderForm.css
│   │   │   ├── ReminderList.js   # List of reminders
│   │   │   └── ReminderList.css
│   │   ├── services/
│   │   │   └── api.js            # API service
│   │   ├── utils/
│   │   │   └── notifications.js  # Notification utilities
│   │   ├── App.js                # Main app component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Reminders

- `GET /api/reminders` - Get all reminders
- `GET /api/reminders/:id` - Get a single reminder
- `POST /api/reminders` - Create a new reminder
- `PUT /api/reminders/:id` - Update a reminder
- `DELETE /api/reminders/:id` - Delete a reminder
- `POST /api/reminders/check-location` - Check for location-based reminders

### Request/Response Examples

**Create a Time-Based Reminder (POST /api/reminders)**
```json
{
  "title": "Team Meeting",
  "description": "Discuss Q1 goals",
  "dueDate": "2026-01-30T14:00:00",
  "priority": "high"
}
```

**Create a Location-Based Reminder (POST /api/reminders)**
```json
{
  "title": "Buy groceries",
  "description": "Get milk, eggs, and bread",
  "dueDate": "2026-01-30T18:00:00",
  "priority": "medium",
  "location": {
    "name": "Whole Foods Market",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "radius": 150
  }
}
```

**Response**
```json
{
  "_id": "65b8c9d4e1234567890abcde",
  "title": "Buy groceries",
  "description": "Get milk, eggs, and bread",
  "dueDate": "2026-01-30T18:00:00.000Z",
  "priority": "medium",
  "location": {
    "name": "Whole Foods Market",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "radius": 150
  },
  "completed": false,
  "notified": false,
  "locationNotified": false,
  "createdAt": "2026-01-29T10:00:00.000Z",
  "updatedAt": "2026-01-29T10:00:00.000Z"
}
```

**Check Location Reminders (POST /api/reminders/check-location)**
```json
{
  "latitude": 37.7750,
  "longitude": -122.4195
}
```

**Response**
```json
{
  "reminders": [
    {
      "_id": "65b8c9d4e1234567890abcde",
      "title": "Buy groceries",
      "description": "Get milk, eggs, and bread",
      "locationName": "Whole Foods Market",
      "distance": 12
    }
  ]
}
```

## 📍 How Location-Based Reminders Work

### Overview
Location-based reminders use the browser's Geolocation API to track your position and notify you when you're near a specified location.

### How to Set Up

1. **Get Location Coordinates**: 
   - Use a mapping service (Google Maps, Apple Maps) to find the coordinates of your location
   - Right-click on the location and select the option to view coordinates
   - Copy the latitude and longitude values

2. **Create the Reminder**:
   - In the reminder form, fill in the "Location Name" (e.g., "Walmart", "Home Depot")
   - Enter the latitude and longitude coordinates
   - Set the notification radius (10-5000 meters) - this is how close you need to be to trigger the reminder
   - Default radius is 100 meters

3. **How It Works**:
   - The app monitors your location in the background (updates are cached for 5 minutes)
   - When you move within the specified radius of the location, you'll receive a notification
   - The reminder is marked as "location notified" to prevent duplicate notifications
   - Location checks are throttled to occur at most once per minute to conserve battery

### Privacy & Permissions
- The app requires location permission to use this feature
- Location data is only used to check proximity to your saved reminders
- No location data is stored or sent to external servers
- You can deny location permission and still use time-based reminders

### Tips
- Use a larger radius (200-500m) for general areas like grocery stores
- Use a smaller radius (50-100m) for specific locations like your home
- Location accuracy depends on your device and GPS signal strength

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Security Considerations for Production

**Important**: Before deploying to production, consider adding the following security enhancements:

- **Rate Limiting**: Install and configure `express-rate-limit` to prevent abuse
  ```bash
  npm install express-rate-limit
  ```
  ```javascript
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);
  ```
- **Authentication**: Add user authentication (JWT, OAuth, etc.)
- **Input Validation**: Use libraries like `express-validator` for robust input validation
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit sensitive data; use environment variables
- **CORS Configuration**: Restrict CORS to specific origins in production
- **Database Security**: Use strong passwords, enable authentication, restrict network access

### Backend Deployment
1. Set up a MongoDB Atlas account or use your own MongoDB instance
2. Update the `MONGODB_URI` in your production environment
3. Add rate limiting and other security measures
4. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Build the React app:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `build` folder to your hosting service (Netlify, Vercel, GitHub Pages, etc.)
3. Update the `REACT_APP_API_URL` to point to your production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

nadeemus

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Express.js for the simple and flexible backend framework
- MongoDB for the powerful database
- node-cron for easy task scheduling
