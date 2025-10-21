# 🗄️ Database Schema Documentation

## Overview

The Futuristic Appointment Scheduler uses **SQLite** as its database for simplicity and portability. The database is created automatically when the server starts for the first time.

## Database File

- **Location**: `backend/database.sqlite`
- **Type**: SQLite3
- **Created**: Automatically on first run
- **Configurable**: Via `DB_PATH` environment variable

---

## Tables

### `appointments`

Main table storing all appointment information.

#### Schema

```sql
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  service_type TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  email_notification_sent INTEGER DEFAULT 0,
  sms_notification_sent INTEGER DEFAULT 0,
  google_calendar_event_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | TEXT | No | - | Unique identifier (UUID v4) |
| `name` | TEXT | No | - | Full name of the customer |
| `email` | TEXT | No | - | Email address for notifications |
| `phone` | TEXT | Yes | NULL | Phone number for SMS (optional) |
| `appointment_date` | TEXT | No | - | Date in YYYY-MM-DD format |
| `appointment_time` | TEXT | No | - | Time in HH:MM format (24-hour) |
| `service_type` | TEXT | No | - | Type of service requested |
| `status` | TEXT | No | 'scheduled' | Current status: 'scheduled' or 'cancelled' |
| `email_notification_sent` | INTEGER | No | 0 | 0 = not sent, 1 = sent |
| `sms_notification_sent` | INTEGER | No | 0 | 0 = not sent, 1 = sent |
| `google_calendar_event_id` | TEXT | Yes | NULL | Reserved for Google Calendar integration |
| `created_at` | TEXT | No | CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TEXT | No | CURRENT_TIMESTAMP | Last update timestamp |

#### Indexes

```sql
-- Index for faster date/time lookups
CREATE INDEX idx_appointment_datetime 
ON appointments(appointment_date, appointment_time);

-- Index for status filtering
CREATE INDEX idx_appointment_status 
ON appointments(status);

-- Index for notification queries
CREATE INDEX idx_notification_sent 
ON appointments(email_notification_sent, sms_notification_sent);
```

#### Constraints

- **Primary Key**: `id` must be unique
- **Not Null**: `name`, `email`, `appointment_date`, `appointment_time`, `service_type` are required
- **Double Booking Prevention**: Enforced at application level, not database level

---

## Data Types

### Date and Time Storage

- **Date Format**: `YYYY-MM-DD` (e.g., "2025-10-21")
- **Time Format**: `HH:MM` in 24-hour format (e.g., "14:30")
- **Timezone**: Stored in local timezone, handled by application

### Boolean Values

SQLite doesn't have a native boolean type, so we use INTEGER:
- `0` = false
- `1` = true

### Status Values

| Value | Description |
|-------|-------------|
| `scheduled` | Appointment is active and scheduled |
| `cancelled` | Appointment has been cancelled |

---

## Database Operations

### Create Appointment

```javascript
const appointment = {
  id: uuidv4(),
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  appointment_date: '2025-10-21',
  appointment_time: '14:30',
  service_type: 'General Consultation'
};

await dbHelpers.createAppointment(appointment);
```

### Check Slot Availability

```javascript
const isAvailable = await dbHelpers.isSlotAvailable('2025-10-21', '14:30');
```

### Get Upcoming Appointments

```javascript
const upcoming = await dbHelpers.getUpcomingAppointments();
// Returns appointments in next 24 hours
```

### Get Appointments Needing Notification

```javascript
const needsNotification = await dbHelpers.getAppointmentsNeedingNotification();
// Returns appointments 10 minutes away that haven't been notified
```

### Update Notification Status

```javascript
await dbHelpers.markNotificationSent(appointmentId, 'email');
await dbHelpers.markNotificationSent(appointmentId, 'sms');
```

### Cancel Appointment

```javascript
await dbHelpers.updateAppointment(appointmentId, { status: 'cancelled' });
```

### Delete Appointment

```javascript
await dbHelpers.deleteAppointment(appointmentId);
```

---

## Query Examples

### All Scheduled Appointments

```sql
SELECT * FROM appointments 
WHERE status = 'scheduled' 
ORDER BY appointment_date, appointment_time;
```

### Today's Appointments

```sql
SELECT * FROM appointments 
WHERE appointment_date = date('now') 
AND status = 'scheduled';
```

### Appointments in Date Range

```sql
SELECT * FROM appointments 
WHERE appointment_date BETWEEN '2025-10-01' AND '2025-10-31'
ORDER BY appointment_date, appointment_time;
```

### Appointments Needing Email Notification

```sql
SELECT * FROM appointments 
WHERE status = 'scheduled'
AND email_notification_sent = 0
AND datetime(appointment_date || ' ' || appointment_time) <= datetime('now', '+10 minutes')
AND datetime(appointment_date || ' ' || appointment_time) > datetime('now');
```

### Appointments by Service Type

```sql
SELECT service_type, COUNT(*) as count 
FROM appointments 
GROUP BY service_type 
ORDER BY count DESC;
```

### Recent Appointments

```sql
SELECT * FROM appointments 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## Database Helpers

The `database.js` file provides helper functions for common operations:

### Available Helpers

```javascript
dbHelpers = {
  getAllAppointments(),
  getAppointmentById(id),
  isSlotAvailable(date, time, excludeId),
  createAppointment(appointment),
  updateAppointment(id, updates),
  deleteAppointment(id),
  getUpcomingAppointments(),
  getAppointmentsNeedingNotification(),
  markNotificationSent(id, type),
  getAppointmentsByDateRange(startDate, endDate)
}
```

All helpers return **Promises** for async/await support.

---

## Backup and Restore

### Backup Database

```bash
# Simple copy
cp backend/database.sqlite backend/database.backup.sqlite

# With timestamp
cp backend/database.sqlite backend/database.$(date +%Y%m%d_%H%M%S).sqlite
```

### Restore Database

```bash
cp backend/database.backup.sqlite backend/database.sqlite
```

### Export to SQL

```bash
sqlite3 backend/database.sqlite .dump > backup.sql
```

### Import from SQL

```bash
sqlite3 backend/database.sqlite < backup.sql
```

---

## Migration to PostgreSQL

For production environments with higher traffic, consider PostgreSQL:

### 1. Install PostgreSQL Driver

```bash
npm install pg
```

### 2. Update Database Configuration

```javascript
// Using pg instead of sqlite3
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

### 3. Update Schema for PostgreSQL

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  email_notification_sent BOOLEAN DEFAULT FALSE,
  sms_notification_sent BOOLEAN DEFAULT FALSE,
  google_calendar_event_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Export Data from SQLite

```bash
sqlite3 database.sqlite .dump > export.sql
```

### 5. Import to PostgreSQL

Modify the SQL file for PostgreSQL compatibility and import.

---

## Performance Considerations

### Indexes

The application creates three indexes for optimal performance:
1. **DateTime Index** - Fast slot availability checks
2. **Status Index** - Quick filtering by status
3. **Notification Index** - Efficient notification queries

### Limitations

**SQLite Limitations**:
- Not suitable for high concurrency
- Limited to single file
- No user management
- Basic transaction support

**Recommendations**:
- Use SQLite for development and small deployments
- Use PostgreSQL for production with high traffic
- Implement connection pooling for PostgreSQL
- Regular backups for data safety

---

## Data Validation

### Application-Level Validation

The application validates data before inserting:

```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Date validation (not in past)
const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
if (appointmentDateTime < new Date()) {
  throw new Error('Cannot book past appointments');
}

// Double-booking check
const isAvailable = await dbHelpers.isSlotAvailable(date, time);
if (!isAvailable) {
  throw new Error('Time slot already booked');
}
```

---

## Testing the Database

### Manual Testing

```bash
# Open SQLite console
sqlite3 backend/database.sqlite

# Run queries
SELECT * FROM appointments;
SELECT COUNT(*) FROM appointments WHERE status = 'scheduled';
```

### Programmatic Testing

```javascript
// Test database connection
const { db, dbHelpers } = require('./database');

// Create test appointment
const testAppointment = {
  id: 'test-123',
  name: 'Test User',
  email: 'test@example.com',
  appointment_date: '2025-12-31',
  appointment_time: '10:00',
  service_type: 'Test Service'
};

await dbHelpers.createAppointment(testAppointment);
console.log('Test appointment created!');
```

---

## Future Enhancements

### Planned Features

1. **User Authentication Table**
   - Store user credentials
   - Role-based access control

2. **Service Types Table**
   - Dynamic service management
   - Pricing information

3. **Availability Rules Table**
   - Business hours
   - Holidays
   - Custom availability

4. **Audit Log Table**
   - Track all changes
   - User actions
   - System events

### Google Calendar Integration

```sql
ALTER TABLE appointments 
ADD COLUMN google_calendar_synced INTEGER DEFAULT 0;
```

---

## Troubleshooting

### Database Locked

```bash
# Check for processes using the database
lsof | grep database.sqlite

# Kill hanging connections
# Or restart the application
```

### Corruption

```bash
# Check integrity
sqlite3 database.sqlite "PRAGMA integrity_check;"

# Recover from corruption
sqlite3 database.sqlite ".dump" | sqlite3 new_database.sqlite
```

### Reset Database

```bash
# Delete database file
rm backend/database.sqlite

# Restart server to recreate
npm start
```

---

**Database Version**: 1.0  
**Last Updated**: October 2025  
**Schema Format**: SQLite 3.x

