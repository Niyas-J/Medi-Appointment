// Vercel Serverless Function - Main API Entry Point
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const appointmentsRouter = require('./routes/appointments');

const app = express();

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
    timestamp: new Date().toISOString(),
    platform: 'Vercel Serverless'
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: '🚀 Welcome to Futuristic Appointment Scheduler API',
    version: '1.0.0',
    platform: 'Vercel Serverless',
    endpoints: {
      health: '/api/health',
      appointments: '/api/appointments',
      upcoming: '/api/appointments/upcoming',
      export: '/api/appointments/export/csv'
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

// Export for Vercel
module.exports = app;

