# 🚀 Quick Setup Guide

This guide will help you get the Futuristic Appointment Scheduler up and running in minutes!

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **Gmail account** (for email notifications)
- ⚡ **Twilio account** (optional, for SMS notifications)

## 🎯 Step-by-Step Setup

### Step 1: Navigate to Project Directory

```bash
cd "C:\Users\anees\OneDrive\Desktop\Medi-Shd"
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages for the backend server.

### Step 3: Configure Email Service

You need a Gmail App Password for email notifications:

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Security** → **2-Step Verification** (enable if not already)
3. **App passwords** → **Generate new app password**
4. **Select app**: Mail
5. **Select device**: Other (Custom name) → "Appointment Scheduler"
6. **Copy the 16-character password** (you'll need this next)

### Step 4: Create Environment File

Create a file named `.env` in the `backend` folder with this content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (REQUIRED)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Twilio Configuration (OPTIONAL - for SMS)
# Leave blank if you don't want SMS notifications
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Database
DB_PATH=./database.sqlite
```

**Replace**:
- `your-email@gmail.com` with your Gmail address
- `your-16-char-app-password` with the app password from Step 3

### Step 5: Install Frontend Dependencies

Open a **new terminal** window:

```bash
cd "C:\Users\anees\OneDrive\Desktop\Medi-Shd\frontend"
npm install
```

### Step 6: Start the Backend Server

In the first terminal (backend folder):

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║   🚀 Futuristic Appointment Scheduler API                ║
║                                                           ║
║   Server running on port 5000                            ║
║   Environment: development                                ║
╚═══════════════════════════════════════════════════════════╝

Connected to SQLite database
Appointments table ready
Starting notification scheduler...
Notification scheduler is running (checks every minute)
```

### Step 7: Start the Frontend

In the second terminal (frontend folder):

```bash
npm start
```

The application will automatically open in your browser at:
**http://localhost:3000**

## 🎉 You're Done!

The application is now running! You can:

1. **Book an appointment** → Navigate to "Book Appointment"
2. **View admin dashboard** → Navigate to "Admin Dashboard"
3. **See timeline** → Navigate to "Timeline"
4. **Toggle theme** → Click the sun/moon icon in the navigation

## 🧪 Testing the Application

### Test Booking

1. Go to **Book Appointment**
2. Fill in the form:
   - **Name**: Your Name
   - **Email**: Your email (you'll receive confirmation here)
   - **Date**: Tomorrow
   - **Time**: Any time
   - **Service**: Select any service
3. Click **Book Appointment**
4. Check your email for confirmation! 📧

### Test Notifications

To test the 10-minute reminder:

1. Book an appointment for **11 minutes from now**
2. Wait 1 minute
3. The scheduler will detect it and send the reminder
4. Check your email! 📬

### Test Admin Dashboard

1. Go to **Admin Dashboard**
2. You should see your booked appointment
3. Try filtering: All, Upcoming, Today, Past
4. Try the search bar
5. Click **Export CSV** to download appointments

## 🔧 Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

**Backend**: Edit `backend/.env` and change `PORT=5000` to `PORT=5001`

**Frontend**: The app will prompt you to use a different port automatically

### Email Not Sending

1. ✅ Check `.env` file has correct credentials
2. ✅ Verify app password (not regular Gmail password)
3. ✅ Check spam folder
4. ✅ Ensure "Less secure app access" is enabled (if needed)

### Database Errors

If you see database errors:

```bash
# Delete the database and restart
cd backend
rm database.sqlite
npm start
```

### Cannot Find Module

If you see "Cannot find module" errors:

```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

## 📱 SMS Setup (Optional)

To enable SMS notifications:

1. **Create Twilio account**: https://www.twilio.com/try-twilio
2. **Get credentials**:
   - Account SID
   - Auth Token
   - Phone Number
3. **Update `.env`**:
   ```env
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```
4. **Restart backend server**

## 🎨 Customization

### Change Service Types

Edit `frontend/src/config.js`:

```javascript
SERVICE_TYPES: [
  'Your Service 1',
  'Your Service 2',
  // Add more...
]
```

### Change Theme Colors

Edit `frontend/src/index.css`:

```css
:root {
  --accent-primary: #667eea;  /* Change this */
  --accent-secondary: #764ba2; /* And this */
}
```

### Change Notification Timing

Edit `backend/services/schedulerService.js`:

```javascript
// Change from 10 minutes to 30 minutes
datetime('now', '+30 minutes')
```

## 📚 What's Next?

- ✅ Read the full [README.md](README.md) for all features
- ✅ Check [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production
- ✅ Review [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for database structure
- ✅ Customize the app to your needs!

## 💡 Quick Commands

### Stop the Application

In both terminal windows, press: **Ctrl + C**

### Restart Backend

```bash
cd backend
npm start
```

### Restart Frontend

```bash
cd frontend
npm start
```

### View Database

```bash
cd backend
sqlite3 database.sqlite
.tables
SELECT * FROM appointments;
.quit
```

### Reset Everything

```bash
# Delete database
cd backend
rm database.sqlite

# Clear cache
cd ../frontend
rm -rf build

# Restart both servers
```

## 🆘 Need Help?

1. **Check logs** in the terminal for error messages
2. **Review troubleshooting** section above
3. **Read full documentation** in README.md
4. **Create an issue** on GitHub

## ✅ Verification Checklist

Before using in production:

- [ ] Email notifications working
- [ ] SMS notifications working (if enabled)
- [ ] Can book appointments
- [ ] No double-booking possible
- [ ] Admin dashboard accessible
- [ ] CSV export working
- [ ] Timeline view showing appointments
- [ ] Dark/light mode toggle working
- [ ] Responsive on mobile
- [ ] All forms validating properly

## 🎊 Success!

If you can book an appointment and receive an email, you're all set!

**Enjoy your Futuristic Appointment Scheduler! 🚀**

---

**Time to Complete**: 10-15 minutes  
**Difficulty**: Easy  
**Support**: Create an issue if you need help!

