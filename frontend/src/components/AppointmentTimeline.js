import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaCalendarAlt, FaClock, FaUser, FaServicestack } from 'react-icons/fa';
import config from '../config';
import './AppointmentTimeline.css';

function AppointmentTimeline() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_BASE_URL}/appointments`);
      if (response.data.success) {
        // Sort by date and time
        const sorted = response.data.appointments
          .filter(apt => apt.status === 'scheduled')
          .sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return dateA - dateB;
          });
        setAppointments(sorted);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'EEEE, MMMM dd, yyyy');
    } catch {
      return date;
    }
  };

  const formatTime = (time) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'hh:mm a');
    } catch {
      return time;
    }
  };

  const isUpcoming = (date, time) => {
    const aptDate = new Date(`${date}T${time}`);
    return aptDate >= new Date();
  };

  const groupByDate = () => {
    const grouped = {};
    appointments.forEach(apt => {
      if (!grouped[apt.appointment_date]) {
        grouped[apt.appointment_date] = [];
      }
      grouped[apt.appointment_date].push(apt);
    });
    return grouped;
  };

  const groupedAppointments = groupByDate();

  return (
    <div className="timeline-container fade-in">
      <div className="timeline-header">
        <h1 className="timeline-title">
          <FaCalendarAlt /> Appointment Timeline
        </h1>
        <p className="timeline-subtitle">
          Visual timeline of all scheduled appointments
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading timeline...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt className="empty-icon" />
          <h3>No Scheduled Appointments</h3>
          <p>There are no appointments scheduled at the moment.</p>
        </div>
      ) : (
        <div className="timeline">
          {Object.keys(groupedAppointments).map((date) => (
            <div key={date} className="timeline-date-group">
              <div className="date-header">
                <FaCalendarAlt className="date-icon" />
                <h2 className="date-title">{formatDate(date)}</h2>
              </div>

              <div className="timeline-items">
                {groupedAppointments[date].map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className={`timeline-item ${isUpcoming(appointment.appointment_date, appointment.appointment_time) ? 'upcoming' : 'past'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="timeline-marker">
                      <div className="marker-dot"></div>
                      {index < groupedAppointments[date].length - 1 && (
                        <div className="marker-line"></div>
                      )}
                    </div>

                    <div className="timeline-content">
                      <div className="timeline-time">
                        <FaClock />
                        {formatTime(appointment.appointment_time)}
                      </div>

                      <div className="timeline-card">
                        <div className="card-header">
                          <h3 className="appointment-name">
                            <FaUser /> {appointment.name}
                          </h3>
                          {isUpcoming(appointment.appointment_date, appointment.appointment_time) && (
                            <span className="badge-upcoming">Upcoming</span>
                          )}
                        </div>

                        <div className="card-body">
                          <div className="info-item">
                            <FaServicestack className="info-icon" />
                            <span>{appointment.service_type}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{appointment.email}</span>
                          </div>
                          {appointment.phone && (
                            <div className="info-item">
                              <span className="info-label">Phone:</span>
                              <span className="info-value">{appointment.phone}</span>
                            </div>
                          )}
                        </div>

                        <div className="card-footer">
                          <div className="notification-status">
                            {appointment.email_notification_sent ? (
                              <span className="status-sent">✓ Email Sent</span>
                            ) : (
                              <span className="status-pending">○ Email Pending</span>
                            )}
                            {appointment.phone && (
                              <>
                                {appointment.sms_notification_sent ? (
                                  <span className="status-sent">✓ SMS Sent</span>
                                ) : (
                                  <span className="status-pending">○ SMS Pending</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentTimeline;

