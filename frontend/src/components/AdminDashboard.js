import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  FaDownload, 
  FaTrash, 
  FaTimes, 
  FaCheckCircle, 
  FaEnvelope, 
  FaSms,
  FaCalendarAlt,
  FaFilter,
  FaSync
} from 'react-icons/fa';
import config from '../config';
import './AdminDashboard.css';

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, today
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_BASE_URL}/appointments`);
      if (response.data.success) {
        setAppointments(response.data.appointments);
        setFilteredAppointments(response.data.appointments);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments
  useEffect(() => {
    let filtered = [...appointments];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
      case 'upcoming':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
          return aptDate >= now && apt.status === 'scheduled';
        });
        break;
      case 'past':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
          return aptDate < now;
        });
        break;
      case 'today':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.appointment_date);
          return aptDate.getTime() === today.getTime();
        });
        break;
      default:
        break;
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  }, [filter, searchTerm, appointments]);

  // Cancel appointment
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await axios.patch(`${config.API_BASE_URL}/appointments/${id}/cancel`);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error('Error cancelling appointment:', error);
    }
  };

  // Delete appointment
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${config.API_BASE_URL}/appointments/${id}`);
      toast.success('Appointment deleted successfully');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to delete appointment');
      console.error('Error deleting appointment:', error);
    }
  };

  // Export to CSV
  const handleExportCSV = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/appointments/export/csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `appointments_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Appointments exported successfully!');
    } catch (error) {
      toast.error('Failed to export appointments');
      console.error('Error exporting appointments:', error);
    }
  };

  // Format date and time
  const formatDateTime = (date, time) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return format(dateTime, 'MMM dd, yyyy · hh:mm a');
    } catch {
      return `${date} · ${time}`;
    }
  };

  // Get status badge class
  const getStatusClass = (appointment) => {
    const aptDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    const now = new Date();

    if (appointment.status === 'cancelled') return 'status-cancelled';
    if (aptDate < now) return 'status-past';
    return 'status-upcoming';
  };

  // Get status text
  const getStatusText = (appointment) => {
    const aptDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    const now = new Date();

    if (appointment.status === 'cancelled') return 'Cancelled';
    if (aptDate < now) return 'Completed';
    return 'Upcoming';
  };

  // Statistics
  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(apt => {
      const aptDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
      return aptDate >= new Date() && apt.status === 'scheduled';
    }).length,
    today: appointments.filter(apt => {
      const today = new Date();
      const aptDate = new Date(apt.appointment_date);
      return aptDate.toDateString() === today.toDateString();
    }).length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  };

  return (
    <div className="admin-dashboard fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            <FaCalendarAlt /> Admin Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Manage and monitor all appointments
          </p>
        </div>
        <div className="header-actions">
          <button onClick={fetchAppointments} className="btn btn-secondary">
            <FaSync /> Refresh
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary">
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-gradient)' }}>
            <FaCalendarAlt />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-gradient-success)' }}>
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.upcoming}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-gradient-alt)' }}>
            <FaCalendarAlt />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.today}</div>
            <div className="stat-label">Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%)' }}>
            <FaTimes />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="controls-bar">
        <div className="filter-group">
          <FaFilter />
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button 
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Appointments Table */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt className="empty-icon" />
          <h3>No appointments found</h3>
          <p>There are no appointments matching your filters.</p>
        </div>
      ) : (
        <div className="appointments-table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date & Time</th>
                <th>Service</th>
                <th>Status</th>
                <th>Notifications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="appointment-row">
                  <td className="name-cell">{appointment.name}</td>
                  <td className="email-cell">{appointment.email}</td>
                  <td>{appointment.phone || 'N/A'}</td>
                  <td className="datetime-cell">
                    {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                  </td>
                  <td>{appointment.service_type}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(appointment)}`}>
                      {getStatusText(appointment)}
                    </span>
                  </td>
                  <td>
                    <div className="notification-icons">
                      <span 
                        className={`notification-icon ${appointment.email_notification_sent ? 'sent' : ''}`}
                        title={appointment.email_notification_sent ? 'Email sent' : 'Email pending'}
                      >
                        <FaEnvelope />
                      </span>
                      {appointment.phone && (
                        <span 
                          className={`notification-icon ${appointment.sms_notification_sent ? 'sent' : ''}`}
                          title={appointment.sms_notification_sent ? 'SMS sent' : 'SMS pending'}
                        >
                          <FaSms />
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {appointment.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="action-btn cancel-btn"
                          title="Cancel appointment"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="action-btn delete-btn"
                        title="Delete appointment"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

