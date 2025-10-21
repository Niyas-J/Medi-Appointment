# 📁 Project Structure

Complete overview of the Futuristic Appointment Scheduler codebase.

## 🗂️ Directory Tree

```
Medi-Shd/
│
├── backend/                          # Backend server (Node.js/Express)
│   ├── routes/                       # API route handlers
│   │   └── appointments.js           # Appointment CRUD operations
│   │
│   ├── services/                     # Business logic services
│   │   ├── notificationService.js    # Email/SMS notifications
│   │   └── schedulerService.js       # Automated scheduling
│   │
│   ├── server.js                     # Main server entry point
│   ├── database.js                   # Database setup & helpers
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables (create this!)
│   ├── .gitignore                    # Git ignore rules
│   ├── Procfile                      # Heroku deployment config
│   └── database.sqlite               # SQLite database (auto-created)
│
├── frontend/                         # Frontend app (React)
│   ├── public/                       # Static assets
│   │   └── index.html                # HTML template
│   │
│   ├── src/                          # Source code
│   │   ├── components/               # React components
│   │   │   ├── HomePage.js           # Landing page component
│   │   │   ├── HomePage.css          # Landing page styles
│   │   │   ├── BookingForm.js        # Booking form component
│   │   │   ├── BookingForm.css       # Booking form styles
│   │   │   ├── AdminDashboard.js     # Admin dashboard component
│   │   │   ├── AdminDashboard.css    # Admin dashboard styles
│   │   │   ├── AppointmentTimeline.js # Timeline component
│   │   │   └── AppointmentTimeline.css # Timeline styles
│   │   │
│   │   ├── App.js                    # Main app component
│   │   ├── App.css                   # Main app styles
│   │   ├── index.js                  # React entry point
│   │   ├── index.css                 # Global styles & theme
│   │   └── config.js                 # App configuration
│   │
│   ├── package.json                  # Frontend dependencies
│   ├── .gitignore                    # Git ignore rules
│   └── build/                        # Production build (auto-created)
│
├── README.md                         # Main documentation
├── SETUP_GUIDE.md                    # Quick setup instructions
├── DEPLOYMENT.md                     # Deployment guide
├── DATABASE_SCHEMA.md                # Database documentation
├── FEATURES.md                       # Feature list
├── PROJECT_STRUCTURE.md              # This file
├── LICENSE                           # MIT License
├── package.json                      # Root package.json
└── .gitignore                        # Root git ignore
```

## 📄 File Descriptions

### Backend Files

#### `server.js`
- **Purpose**: Main Express server
- **Key Features**:
  - Express app initialization
  - Middleware setup (CORS, body-parser)
  - Route registration
  - Server startup
  - Scheduler initialization
- **Routes**:
  - `GET /` - API info
  - `GET /api/health` - Health check
  - `GET /api/scheduler/status` - Scheduler status
  - `/api/appointments/*` - Appointment routes

#### `database.js`
- **Purpose**: Database setup and helpers
- **Key Features**:
  - SQLite connection
  - Table creation
  - Index creation
  - Helper functions for CRUD
  - Promise-based API
- **Exports**: `db`, `dbHelpers`

#### `routes/appointments.js`
- **Purpose**: Appointment API endpoints
- **Endpoints**:
  - `GET /api/appointments` - Get all
  - `GET /api/appointments/upcoming` - Get upcoming
  - `GET /api/appointments/:id` - Get by ID
  - `POST /api/appointments` - Create new
  - `PUT /api/appointments/:id` - Update
  - `PATCH /api/appointments/:id/cancel` - Cancel
  - `DELETE /api/appointments/:id` - Delete
  - `GET /api/appointments/export/csv` - Export CSV
  - `GET /api/appointments/range/:start/:end` - Date range

#### `services/notificationService.js`
- **Purpose**: Email and SMS notifications
- **Functions**:
  - `sendEmailNotification()` - Send reminder
  - `sendSMSNotification()` - Send SMS
  - `sendBookingConfirmation()` - Confirmation email
- **Technologies**: Nodemailer, Twilio

#### `services/schedulerService.js`
- **Purpose**: Automated notification scheduling
- **Functions**:
  - `startNotificationScheduler()` - Start cron job
  - `getSchedulerStatus()` - Get status
- **Schedule**: Runs every minute

### Frontend Files

#### `src/App.js`
- **Purpose**: Main React application
- **Features**:
  - Theme management (dark/light)
  - Routing setup
  - Navigation bar
  - Background animations
  - Footer
- **Routes**: Home, Book, Admin, Timeline

#### `src/index.js`
- **Purpose**: React entry point
- **Responsibilities**:
  - ReactDOM rendering
  - Root component mounting

#### `src/index.css`
- **Purpose**: Global styles and theme
- **Includes**:
  - CSS variables for theming
  - Dark/light mode colors
  - Animation keyframes
  - Utility classes
  - Global resets

#### `src/config.js`
- **Purpose**: App configuration
- **Contains**:
  - API base URL
  - Service types list
  - Other constants

#### `src/components/HomePage.js`
- **Purpose**: Landing page
- **Sections**:
  - Hero section
  - Features grid
  - Statistics
  - CTA section
- **Features**: Animations, responsive design

#### `src/components/BookingForm.js`
- **Purpose**: Appointment booking
- **Features**:
  - Form validation
  - Real-time feedback
  - API integration
  - Success/error handling
- **Validation**: Name, email, phone, date, time, service

#### `src/components/AdminDashboard.js`
- **Purpose**: Admin panel
- **Features**:
  - Statistics cards
  - Appointment table
  - Filtering & search
  - CSV export
  - Actions (cancel, delete)
- **Filters**: All, Upcoming, Today, Past

#### `src/components/AppointmentTimeline.js`
- **Purpose**: Timeline view
- **Features**:
  - Chronological display
  - Grouped by date
  - Animated markers
  - Status indicators
  - Responsive design

### Documentation Files

#### `README.md`
- **Purpose**: Main documentation
- **Sections**:
  - Features overview
  - Tech stack
  - Quick start
  - API endpoints
  - Customization
  - Troubleshooting

#### `SETUP_GUIDE.md`
- **Purpose**: Step-by-step setup
- **Includes**:
  - Prerequisites
  - Installation steps
  - Configuration
  - Testing guide
  - Troubleshooting

#### `DEPLOYMENT.md`
- **Purpose**: Deployment instructions
- **Platforms**:
  - Heroku
  - Render
  - Vercel + Railway
  - DigitalOcean
- **Sections**: Environment variables, checklists

#### `DATABASE_SCHEMA.md`
- **Purpose**: Database documentation
- **Includes**:
  - Table schemas
  - Column descriptions
  - Indexes
  - Query examples
  - Migration guide

#### `FEATURES.md`
- **Purpose**: Complete feature list
- **Sections**:
  - Core features
  - UI/UX features
  - Notification features
  - Future enhancements

#### `PROJECT_STRUCTURE.md`
- **Purpose**: This file
- **Content**: Codebase overview

## 🔄 Data Flow

### Booking Flow
```
User → BookingForm.js → POST /api/appointments → 
database.js → sendBookingConfirmation() → User Email
```

### Notification Flow
```
schedulerService.js (every minute) → 
dbHelpers.getAppointmentsNeedingNotification() → 
notificationService.sendEmail/SMS() → 
dbHelpers.markNotificationSent()
```

### Admin Dashboard Flow
```
AdminDashboard.js → GET /api/appointments → 
database.js → Display in table → 
User actions → API calls → Database updates
```

## 🎯 Key Technologies

### Backend Stack
- **Runtime**: Node.js 14+
- **Framework**: Express.js 4.18
- **Database**: SQLite3 5.1
- **Email**: Nodemailer 6.9
- **SMS**: Twilio 4.19
- **Scheduler**: Node-cron 3.0

### Frontend Stack
- **Library**: React 18.2
- **Router**: React Router DOM 6.20
- **HTTP**: Axios 1.6
- **Notifications**: React Toastify 9.1
- **Animations**: Framer Motion 10.16
- **Icons**: React Icons 4.12
- **Dates**: date-fns 2.30

## 📦 Dependencies

### Backend (11 packages)
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "sqlite3": "^5.1.6",
  "node-cron": "^3.0.2",
  "nodemailer": "^6.9.7",
  "twilio": "^4.19.0",
  "dotenv": "^16.3.1",
  "body-parser": "^1.20.2",
  "uuid": "^9.0.1",
  "googleapis": "^128.0.0"
}
```

### Frontend (7 packages)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "axios": "^1.6.2",
  "react-toastify": "^9.1.3",
  "react-icons": "^4.12.0",
  "date-fns": "^2.30.0"
}
```

## 🔧 Configuration Files

### `.env` (Backend)
Environment variables for:
- Server port
- Email credentials
- Twilio credentials
- Frontend URL
- Database path

### `package.json` Files
- Root: Scripts for running both apps
- Backend: Server dependencies & scripts
- Frontend: React dependencies & scripts

### `.gitignore` Files
Prevents committing:
- `node_modules/`
- `.env` files
- Database files
- Build artifacts

## 🚀 Build Process

### Development
```bash
# Backend (Terminal 1)
cd backend
npm start
# Runs on http://localhost:5000

# Frontend (Terminal 2)
cd frontend
npm start
# Runs on http://localhost:3000
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build
# Creates optimized build/ folder

# Deploy backend
cd ../backend
# Deploy to Heroku/Render/etc.
```

## 📊 Code Statistics

- **Total Files**: 30+
- **Lines of Code**: ~5,000+
- **Components**: 4 (Home, Booking, Admin, Timeline)
- **API Endpoints**: 9
- **Database Tables**: 1
- **Documentation Pages**: 6

## 🎨 Styling Approach

- **Method**: CSS Modules + Global styles
- **Naming**: BEM-like convention
- **Theme**: CSS variables
- **Responsive**: Mobile-first
- **Animations**: CSS + Framer Motion

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use `.env.example` for templates
- Different values for dev/prod

### API Security
- Input validation on all endpoints
- Parameterized SQL queries
- CORS configuration
- Error handling

### Data Protection
- Email credentials in env vars
- API keys secured
- No sensitive data in logs

## 📈 Performance

### Backend
- Indexed database queries
- Async/await patterns
- Efficient cron scheduling
- Minimal dependencies

### Frontend
- Code splitting (React)
- Optimized images
- Minified CSS/JS
- Lazy loading (future)

## 🧪 Testing

### Manual Testing
- Feature checklist in README
- Test scenarios documented
- Admin dashboard testing

### Automated Testing (Future)
- Unit tests
- Integration tests
- E2E tests

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ⚠️ IE11 (not supported)

## 🔄 Version Control

### Git Strategy
- Main branch for production
- Feature branches for development
- Semantic versioning

### Ignored Files
- Dependencies
- Environment variables
- Database files
- Build artifacts

## 🎯 Next Steps

1. **Setup**: Follow SETUP_GUIDE.md
2. **Customize**: Modify service types, colors
3. **Deploy**: Use DEPLOYMENT.md
4. **Extend**: Add features from FEATURES.md

---

**Project Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintained By**: Open Source Community

