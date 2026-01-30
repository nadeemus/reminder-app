# Authentication Setup Guide

This guide explains how to set up and use the authentication features in the Reminder App, including email/password login and OAuth with Google and Apple.

## Features

- ✅ Email/Password Registration and Login
- ✅ Google OAuth Sign-In
- ✅ Apple OAuth Sign-In
- ✅ JWT-based Authentication
- ✅ Protected API Routes
- ✅ User-specific Reminders
- ✅ Persistent Sessions

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies

The authentication dependencies are already installed:
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy
- `passport-apple` - Apple OAuth strategy
- `jsonwebtoken` - JWT token generation
- `bcryptjs` - Password hashing
- `express-session` - Session management
- `cookie-parser` - Cookie parsing

#### Configure Environment Variables

Create or update the `.env` file in the `backend` directory with the following variables:

```bash
# Basic Configuration
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reminder-app
NODE_ENV=development

# JWT Secret (REQUIRED - Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Session Secret (REQUIRED - Change in production!)
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google OAuth (Optional - Required for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Apple OAuth (Optional - Required for Apple Sign-In)
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_LOCATION=./AuthKey.p8
APPLE_CALLBACK_URL=http://localhost:5000/api/auth/apple/callback
```

#### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy the Client ID and Client Secret to your `.env` file

#### Setting Up Apple OAuth

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create a Services ID for Sign in with Apple
3. Configure the Return URLs:
   - `http://localhost:5000/api/auth/apple/callback` (development)
   - `https://yourdomain.com/api/auth/apple/callback` (production)
4. Create a Private Key for your app
5. Download the `.p8` file and place it in your backend directory
6. Add the credentials to your `.env` file

### 2. Frontend Setup

The frontend is already configured to work with the authentication system. No additional setup is required beyond ensuring the backend URL is correct.

If your backend runs on a different port, create a `.env` file in the `frontend` directory:

```bash
REACT_APP_API_URL=http://localhost:YOUR_PORT/api
```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login with email/password | Public |
| GET | `/api/auth/me` | Get current user info | Private |
| GET | `/api/auth/google` | Initiate Google OAuth | Public |
| GET | `/api/auth/google/callback` | Google OAuth callback | Public |
| GET | `/api/auth/apple` | Initiate Apple OAuth | Public |
| POST | `/api/auth/apple/callback` | Apple OAuth callback | Public |

### Request Examples

#### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User

```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "authProvider": "local"
}
```

## Using the Frontend

### Registration

1. Navigate to the app URL (http://localhost:3000)
2. If not logged in, you'll see the login page
3. Click "Sign up" to go to the registration page
4. Fill in your name, email, and password
5. Click "Sign Up" or choose "Continue with Google/Apple"

### Login

1. Navigate to the app URL
2. Enter your email and password
3. Click "Sign In" or choose "Continue with Google/Apple"

### OAuth Flow

1. Click "Continue with Google" or "Continue with Apple"
2. You'll be redirected to the OAuth provider
3. Authorize the app
4. You'll be redirected back to the app and automatically logged in

### Logout

1. Click the "Logout" button in the header
2. You'll be redirected to the login page

## Security Features

### Password Security
- Passwords are hashed using bcryptjs before storage
- Minimum password length of 6 characters enforced
- Passwords are never returned in API responses

### JWT Tokens
- Tokens expire after 30 days
- Tokens are stored in localStorage on the client
- All protected routes require valid JWT token

### Session Security
- Express sessions are used for OAuth flows
- Session secrets should be changed in production
- Sessions are not persisted (in-memory only)

### OAuth Security
- OAuth callbacks are validated
- User data is safely merged with existing accounts
- Provider IDs are stored to prevent duplicate accounts

## Protected Routes

All reminder-related routes are now protected and require authentication:

- `GET /api/reminders` - Get user's reminders
- `GET /api/reminders/:id` - Get specific reminder (user ownership verified)
- `POST /api/reminders` - Create reminder (automatically linked to user)
- `PUT /api/reminders/:id` - Update reminder (user ownership verified)
- `DELETE /api/reminders/:id` - Delete reminder (user ownership verified)
- `POST /api/reminders/check-location` - Check location reminders (user-specific)

## Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, optional for OAuth users),
  authProvider: String ('local', 'google', 'apple'),
  providerId: String (OAuth provider user ID),
  createdAt: Date,
  updatedAt: Date
}
```

### Reminder Model (Updated)

```javascript
{
  user: ObjectId (ref: 'User', required),
  title: String (required),
  description: String,
  dueDate: Date (required),
  completed: Boolean,
  notified: Boolean,
  priority: String ('low', 'medium', 'high'),
  location: {
    name: String,
    latitude: Number,
    longitude: Number,
    radius: Number
  },
  locationNotified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### "Not authorized, no token" error
- Ensure you're logged in
- Check that the token is stored in localStorage
- Try logging out and logging back in

### OAuth redirect not working
- Verify callback URLs are correctly configured in OAuth provider settings
- Check that FRONTEND_URL is set correctly in backend .env
- Ensure OAuth credentials are correct

### Can't create/view reminders
- Ensure you're logged in
- Check that JWT token is being sent in Authorization header
- Verify backend is running and MongoDB is connected

### "User already exists" on registration
- The email is already registered
- Try logging in instead
- Or use "Forgot Password" feature (if implemented)

## Production Deployment Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Change SESSION_SECRET to a strong random string
- [ ] Update OAuth callback URLs to production URLs
- [ ] Set FRONTEND_URL to production frontend URL
- [ ] Enable HTTPS for all endpoints
- [ ] Consider adding rate limiting
- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Set up proper CORS configuration
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Add logging and monitoring

## Future Enhancements

Potential improvements to the authentication system:

1. **Email Verification**: Send verification emails on registration
2. **Password Reset**: Allow users to reset forgotten passwords
3. **Two-Factor Authentication**: Add 2FA for extra security
4. **Social Providers**: Add more OAuth providers (Facebook, GitHub, etc.)
5. **Account Settings**: Allow users to update profile, change password
6. **Remember Me**: Option to keep users logged in longer
7. **Activity Log**: Track login history and sessions
8. **Account Deletion**: Allow users to delete their accounts

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check backend console logs for errors
4. Review browser console for frontend errors
5. Ensure all environment variables are set correctly
