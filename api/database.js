// Copy of backend database.js for Vercel serverless
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use /tmp directory for Vercel (ephemeral storage)
const dbPath = process.env.DB_PATH || '/tmp/database.sqlite';

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

// Initialize database tables
function initializeTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
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
    )
  `, (err) => {
    if (err) {
      console.error('Error creating appointments table:', err.message);
    } else {
      console.log('Appointments table ready');
      createIndexes();
    }
  });
}

function createIndexes() {
  db.run(`CREATE INDEX IF NOT EXISTS idx_appointment_datetime 
          ON appointments(appointment_date, appointment_time)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_appointment_status 
          ON appointments(status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_notification_sent 
          ON appointments(email_notification_sent, sms_notification_sent)`);
}

// Database helper functions
const dbHelpers = {
  getAllAppointments: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM appointments ORDER BY appointment_date DESC, appointment_time DESC', 
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  getAppointmentById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM appointments WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  isSlotAvailable: (date, time, excludeId = null) => {
    return new Promise((resolve, reject) => {
      let query = 'SELECT COUNT(*) as count FROM appointments WHERE appointment_date = ? AND appointment_time = ? AND status != ?';
      let params = [date, time, 'cancelled'];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      
      db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row.count === 0);
      });
    });
  },

  createAppointment: (appointment) => {
    return new Promise((resolve, reject) => {
      const { id, name, email, phone, appointment_date, appointment_time, service_type } = appointment;
      
      db.run(
        `INSERT INTO appointments (id, name, email, phone, appointment_date, appointment_time, service_type)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, name, email, phone, appointment_date, appointment_time, service_type],
        function(err) {
          if (err) reject(err);
          else resolve({ id, ...appointment });
        }
      );
    });
  },

  updateAppointment: (id, updates) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(updates), id];
      
      db.run(
        `UPDATE appointments SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values,
        function(err) {
          if (err) reject(err);
          else resolve({ id, changes: this.changes });
        }
      );
    });
  },

  deleteAppointment: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM appointments WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ id, changes: this.changes });
      });
    });
  },

  getUpcomingAppointments: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM appointments 
         WHERE status = 'scheduled'
         AND datetime(appointment_date || ' ' || appointment_time) >= datetime('now')
         AND datetime(appointment_date || ' ' || appointment_time) <= datetime('now', '+1 day')
         ORDER BY appointment_date, appointment_time`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  getAppointmentsByDateRange: (startDate, endDate) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM appointments 
         WHERE appointment_date BETWEEN ? AND ?
         ORDER BY appointment_date, appointment_time`,
        [startDate, endDate],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
};

module.exports = { db, dbHelpers };

