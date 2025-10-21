import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaServicestack, FaRocket } from 'react-icons/fa';
import config from '../config';
import './BookingForm.css';

function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    appointment_date: '',
    appointment_time: '',
    service_type: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Validate form field
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!emailRegex.test(value)) {
          error = 'Invalid email format';
        }
        break;
      case 'phone':
        if (value && !/^\+?[\d\s-()]+$/.test(value)) {
          error = 'Invalid phone number format';
        }
        break;
      case 'appointment_date':
        if (!value) {
          error = 'Date is required';
        } else if (new Date(value) < new Date(getMinDate())) {
          error = 'Cannot select a past date';
        }
        break;
      case 'appointment_time':
        if (!value) {
          error = 'Time is required';
        }
        break;
      case 'service_type':
        if (!value) {
          error = 'Service type is required';
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Live validation
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'phone') { // Phone is optional
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${config.API_BASE_URL}/appointments`, formData);
      
      if (response.data.success) {
        toast.success('🎉 Appointment booked successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          appointment_date: '',
          appointment_time: '',
          service_type: ''
        });
        setErrors({});
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to book appointment. Please try again.');
      }
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-container fade-in">
      <div className="form-header">
        <h1 className="form-title">
          <FaRocket className="title-icon" />
          Book Your Appointment
        </h1>
        <p className="form-subtitle">
          Fill in the details below to schedule your appointment. We'll send you a confirmation email!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <FaUser /> Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <FaEnvelope /> Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="your.email@example.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* Phone Field */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            <FaPhone /> Phone Number <span className="optional">(Optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="+1 234 567 8900"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
          <small className="field-hint">For SMS notifications</small>
        </div>

        {/* Date and Time Row */}
        <div className="form-row">
          {/* Date Field */}
          <div className="form-group">
            <label htmlFor="appointment_date" className="form-label">
              <FaCalendarAlt /> Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="appointment_date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              min={getMinDate()}
              className={`form-input ${errors.appointment_date ? 'error' : ''}`}
            />
            {errors.appointment_date && <span className="error-message">{errors.appointment_date}</span>}
          </div>

          {/* Time Field */}
          <div className="form-group">
            <label htmlFor="appointment_time" className="form-label">
              <FaClock /> Time <span className="required">*</span>
            </label>
            <input
              type="time"
              id="appointment_time"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
              className={`form-input ${errors.appointment_time ? 'error' : ''}`}
            />
            {errors.appointment_time && <span className="error-message">{errors.appointment_time}</span>}
          </div>
        </div>

        {/* Service Type Field */}
        <div className="form-group">
          <label htmlFor="service_type" className="form-label">
            <FaServicestack /> Service Type <span className="required">*</span>
          </label>
          <select
            id="service_type"
            name="service_type"
            value={formData.service_type}
            onChange={handleChange}
            className={`form-input ${errors.service_type ? 'error' : ''}`}
          >
            <option value="">Select a service...</option>
            {config.SERVICE_TYPES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {errors.service_type && <span className="error-message">{errors.service_type}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Booking...
            </>
          ) : (
            <>
              <FaRocket />
              Book Appointment
            </>
          )}
        </button>

        {/* Info Box */}
        <div className="info-box">
          <strong>📧 What happens next?</strong>
          <ul>
            <li>You'll receive a confirmation email immediately</li>
            <li>We'll send you a reminder 10 minutes before your appointment</li>
            <li>You can manage your appointment from the admin dashboard</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;

