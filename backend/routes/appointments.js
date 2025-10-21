const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { dbHelpers } = require('../database');
const { sendBookingConfirmation } = require('../services/notificationService');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await dbHelpers.getAllAppointments();
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
  }
});

// Get upcoming appointments
router.get('/upcoming', async (req, res) => {
  try {
    const appointments = await dbHelpers.getUpcomingAppointments();
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({ success: false, message: 'Error fetching upcoming appointments', error: error.message });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await dbHelpers.getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointment', error: error.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, appointment_date, appointment_time, service_type } = req.body;
    
    // Validation
    if (!name || !email || !appointment_date || !appointment_time || !service_type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, email, appointment_date, appointment_time, service_type' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    // Validate date is not in the past
    const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
    const now = new Date();
    if (appointmentDateTime < now) {
      return res.status(400).json({ success: false, message: 'Cannot book appointments in the past' });
    }
    
    // Check if slot is available
    const isAvailable = await dbHelpers.isSlotAvailable(appointment_date, appointment_time);
    if (!isAvailable) {
      return res.status(409).json({ 
        success: false, 
        message: 'This time slot is already booked. Please choose another time.' 
      });
    }
    
    // Create appointment
    const appointmentId = uuidv4();
    const appointment = {
      id: appointmentId,
      name,
      email,
      phone: phone || null,
      appointment_date,
      appointment_time,
      service_type
    };
    
    const result = await dbHelpers.createAppointment(appointment);
    
    // Send confirmation email
    await sendBookingConfirmation(result);
    
    res.status(201).json({ 
      success: true, 
      message: 'Appointment booked successfully!', 
      appointment: result 
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Error creating appointment', error: error.message });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if appointment exists
    const existing = await dbHelpers.getAppointmentById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // If updating date/time, check availability
    if (updates.appointment_date || updates.appointment_time) {
      const date = updates.appointment_date || existing.appointment_date;
      const time = updates.appointment_time || existing.appointment_time;
      
      const isAvailable = await dbHelpers.isSlotAvailable(date, time, id);
      if (!isAvailable) {
        return res.status(409).json({ 
          success: false, 
          message: 'This time slot is already booked. Please choose another time.' 
        });
      }
    }
    
    await dbHelpers.updateAppointment(id, updates);
    const updated = await dbHelpers.getAppointmentById(id);
    
    res.json({ success: true, message: 'Appointment updated successfully', appointment: updated });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, message: 'Error updating appointment', error: error.message });
  }
});

// Cancel appointment
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await dbHelpers.getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    await dbHelpers.updateAppointment(id, { status: 'cancelled' });
    
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ success: false, message: 'Error cancelling appointment', error: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await dbHelpers.getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    await dbHelpers.deleteAppointment(id);
    
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ success: false, message: 'Error deleting appointment', error: error.message });
  }
});

// Export appointments as CSV
router.get('/export/csv', async (req, res) => {
  try {
    const appointments = await dbHelpers.getAllAppointments();
    
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Date', 'Time', 'Service', 'Status', 'Email Sent', 'SMS Sent', 'Created At'];
    const rows = appointments.map(apt => [
      apt.id,
      apt.name,
      apt.email,
      apt.phone || 'N/A',
      apt.appointment_date,
      apt.appointment_time,
      apt.service_type,
      apt.status,
      apt.email_notification_sent ? 'Yes' : 'No',
      apt.sms_notification_sent ? 'Yes' : 'No',
      apt.created_at
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=appointments.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting appointments:', error);
    res.status(500).json({ success: false, message: 'Error exporting appointments', error: error.message });
  }
});

// Get appointments by date range
router.get('/range/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const appointments = await dbHelpers.getAppointmentsByDateRange(startDate, endDate);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching appointments by date range:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
  }
});

module.exports = router;

