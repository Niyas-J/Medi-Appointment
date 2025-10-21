const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email transporter setup
let emailTransporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  emailTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

// Twilio client setup
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Format date and time for display
function formatDateTime(date, time) {
  const dateObj = new Date(`${date}T${time}`);
  return dateObj.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Send email notification
async function sendEmailNotification(appointment) {
  if (!emailTransporter) {
    console.log('Email service not configured. Skipping email notification.');
    return { success: false, message: 'Email service not configured' };
  }

  const { name, email, appointment_date, appointment_time, service_type } = appointment;
  const formattedDateTime = formatDateTime(appointment_date, appointment_time);

  const mailOptions = {
    from: `"Futuristic Scheduler" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🚀 Upcoming Appointment Reminder',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .appointment-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            padding: 12px;
            background: white;
            border-radius: 8px;
          }
          .label {
            font-weight: 600;
            color: #667eea;
          }
          .value {
            color: #333;
          }
          .alert-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
          }
          .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            margin-top: 20px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Appointment Reminder</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; color: #333;">Hello <strong>${name}</strong>,</p>
            <p style="color: #666;">This is a friendly reminder about your upcoming appointment:</p>
            
            <div class="appointment-card">
              <div class="info-row">
                <span class="label">📅 Date & Time:</span>
                <span class="value">${formattedDateTime}</span>
              </div>
              <div class="info-row">
                <span class="label">🛠️ Service:</span>
                <span class="value">${service_type}</span>
              </div>
            </div>
            
            <div class="alert-box">
              <strong>⏰ Your appointment is in 10 minutes!</strong>
              <p style="margin: 5px 0 0 0;">Please be prepared and on time.</p>
            </div>
            
            <p style="color: #666;">If you need to reschedule or cancel, please contact us as soon as possible.</p>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="btn">View Dashboard</a>
            </center>
          </div>
          <div class="footer">
            <p>Thank you for choosing our service!</p>
            <p style="font-size: 12px; color: #999;">Futuristic Appointment Scheduler © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message };
  }
}

// Send SMS notification
async function sendSMSNotification(appointment) {
  if (!twilioClient || !appointment.phone) {
    console.log('SMS service not configured or phone number missing. Skipping SMS notification.');
    return { success: false, message: 'SMS service not configured or phone missing' };
  }

  const { name, phone, appointment_date, appointment_time, service_type } = appointment;
  const formattedDateTime = formatDateTime(appointment_date, appointment_time);

  const message = `Hi ${name}! 🚀 Reminder: Your appointment for ${service_type} is scheduled for ${formattedDateTime}. See you soon!`;

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    console.log(`SMS sent to ${phone}`);
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, message: error.message };
  }
}

// Send booking confirmation
async function sendBookingConfirmation(appointment) {
  if (!emailTransporter) {
    console.log('Email service not configured. Skipping confirmation email.');
    return { success: false, message: 'Email service not configured' };
  }

  const { name, email, appointment_date, appointment_time, service_type, id } = appointment;
  const formattedDateTime = formatDateTime(appointment_date, appointment_time);

  const mailOptions = {
    from: `"Futuristic Scheduler" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✅ Appointment Confirmed!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .success-icon {
            text-align: center;
            font-size: 80px;
            margin: 20px 0;
          }
          .appointment-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            padding: 12px;
            background: white;
            border-radius: 8px;
          }
          .label {
            font-weight: 600;
            color: #11998e;
          }
          .value {
            color: #333;
          }
          .reference {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #e3f2fd;
            border-radius: 10px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Confirmed!</h1>
          </div>
          <div class="content">
            <div class="success-icon">🎉</div>
            <p style="font-size: 18px; color: #333; text-align: center;">Hello <strong>${name}</strong>,</p>
            <p style="color: #666; text-align: center;">Your appointment has been successfully scheduled!</p>
            
            <div class="appointment-card">
              <div class="info-row">
                <span class="label">📅 Date & Time:</span>
                <span class="value">${formattedDateTime}</span>
              </div>
              <div class="info-row">
                <span class="label">🛠️ Service:</span>
                <span class="value">${service_type}</span>
              </div>
            </div>
            
            <div class="reference">
              <p style="margin: 5px 0; color: #666; font-size: 14px;">Booking Reference</p>
              <p style="margin: 5px 0; font-weight: 700; color: #11998e; font-size: 16px;">${id}</p>
            </div>
            
            <p style="color: #666; text-align: center;">You will receive a reminder 10 minutes before your appointment.</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing our service!</p>
            <p style="font-size: 12px; color: #999;">Futuristic Appointment Scheduler © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
    return { success: true, message: 'Confirmation email sent successfully' };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  sendEmailNotification,
  sendSMSNotification,
  sendBookingConfirmation
};

