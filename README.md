# 🚀 Futuristic Appointment Scheduler

A modern, full-stack web application for scheduling and managing appointments with automated notifications, beautiful UI, and admin dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

### 🎯 Core Features
- **Easy Appointment Booking** - Intuitive form with real-time validation
- **Double-Booking Prevention** - Smart slot management prevents conflicts
- **Automated Notifications** - Email & SMS reminders 10 minutes before appointments
- **Admin Dashboard** - Comprehensive management interface
- **CSV Export** - Export all appointments to CSV format
- **Animated Timeline** - Visual timeline view of scheduled appointments

### 🎨 UI/UX Features
- **Futuristic Design** - Modern gradients, cards, and animations
- **Dark/Light Mode** - Toggle between themes with smooth transitions
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Live Form Validation** - Real-time feedback on user input
- **Toast Notifications** - Beautiful notifications for user actions

### 🔔 Notification Features
- **Email Notifications** - Confirmation emails and reminders
- **SMS Notifications** - Optional SMS reminders via Twilio
- **Automatic Scheduling** - Background job checks every minute
- **Notification Tracking** - Track sent notifications in dashboard

## 📁 Project Structure

```
Medi-Shd/
├── backend/
│   ├── server.js                 # Main server file
│   ├── database.js               # Database setup and helpers
│   ├── package.json              # Backend dependencies
│   ├── routes/
│   │   └── appointments.js       # API routes
│   ├── services/
│   │   ├── notificationService.js    # Email/SMS service
│   │   └── schedulerService.js       # Notification scheduler
│   └── .env.example              # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                # Main app component
│   │   ├── App.css               # Main app styles
│   │   ├── index.js              # React entry point
│   │   ├── index.css             # Global styles
│   │   ├── config.js             # Configuration
│   │   └── components/
│   │       ├── HomePage.js       # Landing page
│   │       ├── HomePage.css
│   │       ├── BookingForm.js    # Booking form
│   │       ├── BookingForm.css
│   │       ├── AdminDashboard.js # Admin panel
│   │       ├── AdminDashboard.css
│   │       ├── AppointmentTimeline.js # Timeline view
│   │       └── AppointmentTimeline.css
│   └── package.json              # Frontend dependencies
├── README.md                     # This file
├── DEPLOYMENT.md                 # Deployment guide
└── DATABASE_SCHEMA.md            # Database schema documentation
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **Nodemailer** - Email service
- **Twilio** - SMS service (optional)
- **Node-cron** - Job scheduler

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **date-fns** - Date formatting

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Gmail account (for email notifications)
- Twilio account (optional, for SMS)

### Installation

1. **Clone the repository**
   ```bash
   cd "C:\Users\anees\OneDrive\Desktop\Medi-Shd"
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   
   # Twilio (Optional)
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   
   # Database
   DB_PATH=./database.sqlite
   ```

   **Note**: For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833).

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 Usage

### Booking an Appointment
1. Navigate to "Book Appointment" in the navigation
2. Fill in the form:
   - Name (required)
   - Email (required)
   - Phone (optional - for SMS notifications)
   - Date & Time (required)
   - Service Type (required)
3. Submit the form
4. Receive confirmation email immediately
5. Get reminder 10 minutes before appointment

### Admin Dashboard
1. Navigate to "Admin Dashboard"
2. View statistics:
   - Total appointments
   - Upcoming appointments
   - Today's appointments
   - Cancelled appointments
3. Filter appointments:
   - All
   - Upcoming
   - Today
   - Past
4. Search by name, email, or service
5. Cancel or delete appointments
6. Export all appointments to CSV

### Timeline View
1. Navigate to "Timeline"
2. View chronological list of all scheduled appointments
3. See notification status for each appointment
4. Animated markers for upcoming appointments

## 🔔 Notification System

### How It Works
1. **Background Scheduler** - Runs every minute
2. **Checks Database** - Finds appointments 10 minutes away
3. **Sends Notifications** - Email and/or SMS
4. **Updates Status** - Marks notifications as sent
5. **Prevents Duplicates** - Only sends once per appointment

### Email Templates
- Beautiful HTML emails with gradient designs
- Booking confirmation on successful booking
- Appointment reminder 10 minutes before

### SMS Messages
- Concise text format
- Includes appointment details
- Sent via Twilio API

## 🌐 API Endpoints

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/export/csv` - Export as CSV
- `GET /api/appointments/range/:startDate/:endDate` - Get by date range

### System
- `GET /api/health` - Health check
- `GET /api/scheduler/status` - Scheduler status

## 🗄️ Database Schema

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for detailed schema documentation.

### Appointments Table
- `id` - Unique identifier (UUID)
- `name` - Customer name
- `email` - Email address
- `phone` - Phone number (optional)
- `appointment_date` - Date of appointment
- `appointment_time` - Time of appointment
- `service_type` - Type of service
- `status` - scheduled/cancelled
- `email_notification_sent` - Boolean
- `sms_notification_sent` - Boolean
- `google_calendar_event_id` - For future Google Calendar integration
- `created_at` - Timestamp
- `updated_at` - Timestamp

## 🎨 Customization

### Service Types
Edit `frontend/src/config.js` to add/modify service types:
```javascript
SERVICE_TYPES: [
  'General Consultation',
  'Dental Checkup',
  // Add more...
]
```

### Email Templates
Customize email templates in `backend/services/notificationService.js`

### Theme Colors
Modify CSS variables in `frontend/src/index.css`:
```css
:root {
  --accent-primary: #667eea;
  --accent-secondary: #764ba2;
  /* ... */
}
```

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Heroku
- Render
- Vercel
- DigitalOcean
- AWS

## 🔒 Security Notes

1. **Environment Variables** - Never commit `.env` file
2. **Email Credentials** - Use app-specific passwords
3. **API Keys** - Keep Twilio credentials secure
4. **CORS** - Configure properly for production
5. **Input Validation** - All inputs are validated
6. **SQL Injection** - Using parameterized queries

## 🧪 Testing

### Manual Testing Checklist
- [ ] Book appointment with valid data
- [ ] Try booking same slot twice (should fail)
- [ ] Verify confirmation email received
- [ ] Check appointment appears in dashboard
- [ ] Test filtering and search
- [ ] Export CSV and verify data
- [ ] View timeline
- [ ] Cancel appointment
- [ ] Delete appointment
- [ ] Toggle dark/light mode
- [ ] Test on mobile device

## 🐛 Troubleshooting

### Email not sending
- Check Gmail app password
- Enable "Less secure app access" if needed
- Verify EMAIL_USER and EMAIL_PASSWORD in .env

### SMS not sending
- Verify Twilio credentials
- Check phone number format (+1234567890)
- Ensure Twilio account has credits

### Database errors
- Check DB_PATH in .env
- Ensure write permissions
- Delete database.sqlite to reset

### Port already in use
- Change PORT in backend/.env
- Update REACT_APP_API_URL in frontend

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository.

## 🎉 Acknowledgments

- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Animations inspired by modern web design trends

---

**Built with ❤️ using Node.js, React, and modern web technologies**

