const cron = require('node-cron');
const { dbHelpers } = require('../database');
const { sendEmailNotification, sendSMSNotification } = require('./notificationService');

// Check for appointments needing notifications every minute
function startNotificationScheduler() {
  console.log('Starting notification scheduler...');
  
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const appointments = await dbHelpers.getAppointmentsNeedingNotification();
      
      if (appointments.length > 0) {
        console.log(`Found ${appointments.length} appointment(s) needing notification`);
        
        for (const appointment of appointments) {
          // Send email notification
          const emailResult = await sendEmailNotification(appointment);
          if (emailResult.success) {
            await dbHelpers.markNotificationSent(appointment.id, 'email');
            console.log(`Email notification sent for appointment ${appointment.id}`);
          }
          
          // Send SMS notification if phone number is provided
          if (appointment.phone) {
            const smsResult = await sendSMSNotification(appointment);
            if (smsResult.success) {
              await dbHelpers.markNotificationSent(appointment.id, 'sms');
              console.log(`SMS notification sent for appointment ${appointment.id}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in notification scheduler:', error);
    }
  });
  
  console.log('Notification scheduler is running (checks every minute)');
}

// Get scheduler status
function getSchedulerStatus() {
  return {
    running: true,
    checkInterval: 'Every minute',
    description: 'Checks for appointments needing notifications (10 minutes before appointment time)'
  };
}

module.exports = {
  startNotificationScheduler,
  getSchedulerStatus
};

