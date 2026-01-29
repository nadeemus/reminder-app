# Reminder App - Architecture & Design

## Overview

The Reminder App is a full-stack application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to create, manage, and receive notifications for reminders.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              React.js Frontend (Port 3000)           │   │
│  │  - Components (ReminderList, ReminderForm)          │   │
│  │  - Services (API, Notifications)                     │   │
│  │  - Web Notifications API                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                        Server Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Express.js Backend (Port 5000)              │   │
│  │  - REST API Routes (/api/reminders)                 │   │
│  │  - Cron Service (node-cron)                         │   │
│  │  - CORS Middleware                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         MongoDB (Port 27017)                         │   │
│  │  - Reminders Collection                              │   │
│  │  - Automatic timestamps                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Scheduling**: node-cron
- **Environment**: dotenv

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection configuration
│   ├── models/
│   │   └── Reminder.js       # Mongoose schema and model
│   ├── routes/
│   │   └── reminders.js      # REST API endpoints
│   ├── services/
│   │   └── cronService.js    # Scheduled notification service
│   └── server.js             # Application entry point
├── .env.example
├── .gitignore
└── package.json
```

### Data Model

**Reminder Schema**:
```javascript
{
  title: String (required, max 100 chars),
  description: String (max 500 chars),
  dueDate: Date (required),
  completed: Boolean (default: false),
  notified: Boolean (default: false),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /api/reminders        | Get all reminders        |
| GET    | /api/reminders/:id    | Get single reminder      |
| POST   | /api/reminders        | Create new reminder      |
| PUT    | /api/reminders/:id    | Update reminder          |
| DELETE | /api/reminders/:id    | Delete reminder          |

### Cron Service

The cron service runs every minute (`* * * * *`) to:
1. Query reminders due within the next 5 minutes
2. Filter out completed and already-notified reminders
3. Log notifications to console
4. Mark reminders as notified in database

## Frontend Architecture

### Technology Stack
- **UI Library**: React.js 19
- **Build Tool**: Create React App (react-scripts)
- **Styling**: CSS3 with responsive design
- **API Communication**: Fetch API

### Project Structure
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ReminderList.js       # Display reminders
│   │   ├── ReminderList.css
│   │   ├── ReminderForm.js       # Create/Edit form
│   │   └── ReminderForm.css
│   ├── services/
│   │   └── api.js                # Backend API service
│   ├── utils/
│   │   └── notifications.js      # Web Notifications API
│   ├── App.js                    # Main component
│   ├── App.css
│   ├── index.js                  # Entry point
│   └── index.css
├── .env
├── .gitignore
└── package.json
```

### Component Hierarchy

```
App
├── Header (with Add button)
├── Error Message (conditional)
└── Main Content (conditional)
    ├── ReminderForm (when creating/editing)
    │   ├── Title input
    │   ├── Description textarea
    │   ├── Due Date input
    │   ├── Priority select
    │   └── Action buttons
    └── ReminderList (when viewing)
        └── ReminderCard (multiple)
            ├── Checkbox (complete toggle)
            ├── Title
            ├── Priority badge
            ├── Description
            ├── Due Date
            └── Actions (Edit, Delete)
```

### State Management

The app uses React hooks for state management:
- `useState` for component state
- `useEffect` for side effects (API calls, notifications)

**Main App State**:
```javascript
{
  reminders: [],           // Array of reminder objects
  showForm: false,         // Toggle form visibility
  editingReminder: null,   // Reminder being edited
  loading: true,           // Loading state
  error: null             // Error message
}
```

### Responsive Design

Breakpoints:
- **Mobile**: < 768px (single column, stacked buttons)
- **Tablet**: 768px - 1199px (adjusted layout)
- **Desktop**: ≥ 1200px (full grid layout)

## Notification System

### Dual Notification Approach

1. **Backend Notifications** (node-cron):
   - Runs every minute
   - Logs to server console
   - Marks reminders as notified in database
   - Ensures persistence across sessions

2. **Frontend Notifications** (Web Notifications API):
   - Runs every minute in browser
   - Shows browser notifications
   - Requires user permission
   - Works only while app is open

### Notification Flow

```
1. User creates reminder with future due date
   ↓
2. Reminder saved to MongoDB
   ↓
3. Every minute:
   - Backend cron checks database → Logs if due soon
   - Frontend interval checks state → Shows browser notification
   ↓
4. When reminder is within 5 minutes of due date:
   - Backend: Logs notification & marks as notified
   - Frontend: Shows browser notification (if permission granted)
```

## Security Considerations

### Current Implementation
- CORS enabled for cross-origin requests
- Environment variables for sensitive configuration
- Input validation on MongoDB schema level
- HTML5 form validation on frontend

### Recommended Enhancements
- Add authentication/authorization
- Implement rate limiting
- Add input sanitization middleware
- Use HTTPS in production
- Implement CSRF protection
- Add API key/token authentication

## Performance Optimizations

### Backend
- Database indexing on `dueDate` field
- Efficient MongoDB queries with `.find()` and `.sort()`
- Async/await for non-blocking operations

### Frontend
- Conditional rendering to minimize DOM updates
- CSS transitions for smooth animations
- Lazy loading could be added for large lists
- Memoization could be added for expensive computations

## Scalability Considerations

### Current Limitations
- Single server instance
- No load balancing
- No caching layer
- No real-time sync between clients

### Future Enhancements
- Add Redis for caching
- Implement WebSockets for real-time updates
- Use message queue (e.g., RabbitMQ) for notification processing
- Horizontal scaling with load balancer
- Separate notification service as microservice
- Add database replication

## Development Workflow

### Local Development
1. Start MongoDB
2. Run backend in dev mode: `npm run dev`
3. Run frontend in dev mode: `npm start`
4. Both support hot-reload

### Production Build
1. Frontend: `npm run build` → static files
2. Backend: `npm start` → production mode
3. Serve frontend build with nginx or similar
4. Use PM2 or similar for backend process management

## Error Handling

### Backend
- Try-catch blocks in all route handlers
- Mongoose validation errors
- 404 for not found resources
- 500 for server errors

### Frontend
- Error state in components
- User-friendly error messages
- Network error handling
- Form validation errors

## Testing Strategy

### Unit Tests
- Backend: Routes, models, services
- Frontend: Components, utilities

### Integration Tests
- API endpoint testing
- Database operations
- Component integration

### E2E Tests
- Full user flows
- Browser compatibility
- Responsive design

See TESTING.md for detailed testing procedures.

## Deployment Architecture

### Recommended Production Setup

```
┌─────────────────────────────────────┐
│         Load Balancer (Nginx)       │
└─────────────────────────────────────┘
              ↓              ↓
┌──────────────────┐  ┌──────────────────┐
│  Frontend (CDN)  │  │  Backend Cluster │
│  Static Files    │  │  (PM2/Docker)    │
└──────────────────┘  └──────────────────┘
                               ↓
                      ┌──────────────────┐
                      │  MongoDB Atlas   │
                      │  (Replica Set)   │
                      └──────────────────┘
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reminder-app
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **node-cron**: Task scheduling
- **nodemon**: Dev auto-reload (dev)

### Frontend
- **react**: UI library
- **react-dom**: React DOM rendering
- **react-scripts**: Build tooling

## License

MIT License - See LICENSE file for details
