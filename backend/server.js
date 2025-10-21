require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const appointmentsRouter = require('./routes/appointments');
const { startNotificationScheduler, getSchedulerStatus } = require('./services/schedulerService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/appointments', appointmentsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Futuristic Appointment Scheduler API is running',
    scheduler: getSchedulerStatus(),
    timestamp: new Date().toISOString()
  });
});

// Scheduler status endpoint
app.get('/api/scheduler/status', (req, res) => {
  res.json({ 
    success: true,
    scheduler: getSchedulerStatus()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to Futuristic Appointment Scheduler API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      appointments: '/api/appointments',
      upcoming: '/api/appointments/upcoming',
      export: '/api/appointments/export/csv',
      scheduler: '/api/scheduler/status'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   🚀 Futuristic Appointment Scheduler API                ║
║                                                           ║
║   Server running on port ${PORT}                             ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
║   API Endpoints:                                          ║
║   • http://localhost:${PORT}/api/health                     ║
║   • http://localhost:${PORT}/api/appointments               ║
║   • http://localhost:${PORT}/api/appointments/upcoming      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  
  // Start the notification scheduler
  startNotificationScheduler();
});

module.exports = app;

