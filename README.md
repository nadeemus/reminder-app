# 📝 Reminder App

A full-stack reminder application built with React.js, Node.js, Express.js, and MongoDB. Features include user authentication, CRUD operations for reminders, time-based notifications using node-cron, and browser notifications via the Web Notifications API.

## 🚀 Features

- 🔐 **User Authentication** - Login/Register with email/password, Google, or Apple
- ✅ Create, read, update, and delete reminders
- ⏰ Set due dates and times for reminders
- 🔔 Browser notifications for upcoming reminders
- 📍 **Location-based reminders** - Get notified when you're near a specific location
- 📊 Priority levels (Low, Medium, High)
- ✓ Mark reminders as complete
- 👤 User-specific reminders and data
- 📱 Responsive design for mobile and desktop
- 🎨 Beautiful gradient UI with modern styling

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **node-cron** - Scheduled tasks for notifications
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
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

# Required for authentication
JWT_SECRET=your-secret-key-change-in-production
SESSION_SECRET=your-session-secret-change-in-production

# Optional: For Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: For Apple OAuth (get from Apple Developer Portal)
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
```

> **Note**: For detailed OAuth setup instructions, see [AUTHENTICATION.md](AUTHENTICATION.md)

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
The frontend is pre-configured to connect to `http://localhost:5000/api`. 

**Optional Configuration**: Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```
# Optional: Backend API URL (if different from default)
REACT_APP_API_URL=http://localhost:YOUR_PORT/api

# Required for location-based reminders with map selection
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

> **Note**: To get a Google Maps API key, see the [Location-Based Reminders Setup](#-how-location-based-reminders-work) section below.

#### Run the frontend
```bash
npm start
```

The React app will start on `http://localhost:3000`

## 📱 Usage

### First Time Setup

1. **Create an Account**:
   - Navigate to `http://localhost:3000`
   - Click "Sign up" on the login page
   - Enter your name, email, and password, OR
   - Click "Continue with Google" or "Continue with Apple" for OAuth login

2. **Login**:
   - Enter your email and password, OR
   - Use Google/Apple OAuth

3. **Allow Notifications**: When you first open the app, allow browser notifications for reminder alerts

4. **Allow Location Access**: For location-based reminders, allow the browser to access your location when prompted

### Using the App

1. **Create a Reminder**:
   - Click the "+ Add Reminder" button
   - Fill in the title, description (optional), due date/time, and priority
   - **For location-based reminders**: Add location name, latitude, longitude, and notification radius
   - Click "Create Reminder"

2. **Manage Reminders**:
   - Check the checkbox to mark a reminder as complete
   - Click "Edit" to modify a reminder
   - Click "Delete" to remove a reminder
   - All reminders are private to your account

3. **Notifications**:
   - **Time-based**: The app checks every minute for reminders due within 5 minutes
   - **Location-based**: The app continuously monitors your location and notifies you when you're within the specified radius of a location
   - You'll receive a browser notification when a reminder is triggered
   - Backend also logs notifications in the server console

4. **Logout**:
   - Click the "Logout" button in the header to sign out

## 🔐 Authentication

The app now includes full authentication support with the following features:

- **Email/Password Authentication**: Traditional registration and login
- **Google OAuth**: Sign in with your Google account
- **Apple OAuth**: Sign in with your Apple ID
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: All reminder data is private and user-specific
- **Persistent Sessions**: Stay logged in across browser sessions

For detailed authentication setup and OAuth configuration, see [AUTHENTICATION.md](AUTHENTICATION.md).

## 🏗️ Project Structure

```
reminder-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # MongoDB connection
│   │   │   └── passport.js       # Passport OAuth configuration
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js           # User schema
│   │   │   └── Reminder.js       # Reminder schema
│   │   ├── routes/
│   │   │   ├── auth.js           # Authentication routes
│   │   │   └── reminders.js      # Reminder API routes
│   │   ├── services/
│   │   │   ├── cronService.js    # Cron job for notifications
│   │   │   └── locationService.js # Location-based reminders
│   │   └── server.js             # Express server setup
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js          # Login component
│   │   │   ├── Register.js       # Registration component
│   │   │   ├── AuthCallback.js   # OAuth callback handler
│   │   │   ├── Auth.css          # Authentication styles
│   │   │   ├── ReminderForm.js   # Add/Edit reminder form
│   │   │   ├── ReminderForm.css
│   │   │   ├── ReminderList.js   # List of reminders
│   │   │   └── ReminderList.css
│   │   ├── context/
│   │   │   └── AuthContext.js    # Authentication context
│   │   ├── services/
│   │   │   ├── api.js            # API service with auth
│   │   │   └── geolocation.js    # Location tracking service
│   │   ├── utils/
│   │   │   └── notifications.js  # Notification utilities
│   │   ├── App.js                # Main app component with routing
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── AUTHENTICATION.md              # Authentication setup guide
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user (Public)
- `POST /api/auth/login` - Login with email/password (Public)
- `GET /api/auth/me` - Get current user info (Private)
- `GET /api/auth/google` - Initiate Google OAuth (Public)
- `GET /api/auth/google/callback` - Google OAuth callback (Public)
- `GET /api/auth/apple` - Initiate Apple OAuth (Public)
- `POST /api/auth/apple/callback` - Apple OAuth callback (Public)

### Reminders (All Private - Require Authentication)

- `GET /api/reminders` - Get all reminders for logged-in user
- `GET /api/reminders/:id` - Get a single reminder
- `POST /api/reminders` - Create a new reminder
- `PUT /api/reminders/:id` - Update a reminder
- `DELETE /api/reminders/:id` - Delete a reminder
- `POST /api/reminders/check-location` - Check for location-based reminders

### Request/Response Examples

**Authentication Header (Required for Private Routes)**
```
Authorization: Bearer <your-jwt-token>
```

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
Location-based reminders use Google Maps for easy location selection and the browser's Geolocation API to track your position and notify you when you're near a specified location.

### Setup Requirements

**Google Maps API Key** (Required for location selection):
1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
4. Create credentials (API Key)
5. Add the API key to your frontend `.env` file:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your-api-key-here
   ```

### How to Set Up

1. **Select a Location**: 
   - In the reminder form, click "📍 Select Location on Map"
   - An interactive Google Map will appear
   - Click anywhere on the map to select a location, or
   - Click "📍 Use Current Location" to use your current position
   - The location name will be automatically filled using reverse geocoding

2. **Create the Reminder**:
   - Verify the location name is correct (you can edit it if needed)
   - Set the notification radius (10-5000 meters) - this is how close you need to be to trigger the reminder
   - Default radius is 100 meters
   - Complete the rest of the reminder details and save

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
- Google Maps API is only used for location selection, not for tracking

### Tips
- Use a larger radius (200-500m) for general areas like grocery stores
- Use a smaller radius (50-100m) for specific locations like your home
- Location accuracy depends on your device and GPS signal strength
- The map allows you to zoom in/out and pan to find the exact location you need

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
