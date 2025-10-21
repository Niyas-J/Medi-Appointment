import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarPlus, FaChartLine, FaClock, FaRocket, FaBell, FaShieldAlt } from 'react-icons/fa';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section fade-in">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Futuristic</span> Appointment Scheduler
          </h1>
          <p className="hero-subtitle">
            Experience the next generation of appointment booking with real-time notifications,
            smart scheduling, and a beautiful interface.
          </p>
          <div className="hero-buttons">
            <Link to="/book" className="btn btn-primary btn-large">
              <FaCalendarPlus /> Book Appointment
            </Link>
            <Link to="/admin" className="btn btn-secondary btn-large">
              <FaChartLine /> Admin Dashboard
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <FaClock className="card-icon" />
            <span>24/7 Available</span>
          </div>
          <div className="floating-card card-2">
            <FaBell className="card-icon" />
            <span>Smart Notifications</span>
          </div>
          <div className="floating-card card-3">
            <FaShieldAlt className="card-icon" />
            <span>Secure & Reliable</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">
          <span className="gradient-text">Amazing Features</span>
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaCalendarPlus />
            </div>
            <h3>Easy Booking</h3>
            <p>Book appointments in seconds with our intuitive interface and smart form validation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaBell />
            </div>
            <h3>Smart Notifications</h3>
            <p>Receive email and SMS reminders 10 minutes before your appointment automatically.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3>No Double Booking</h3>
            <p>Advanced slot management prevents double bookings and scheduling conflicts.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Admin Dashboard</h3>
            <p>Comprehensive dashboard to manage, track, and export all appointments as CSV.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaClock />
            </div>
            <h3>Real-time Updates</h3>
            <p>Get instant updates on appointment status and notification delivery.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaRocket />
            </div>
            <h3>Modern UI/UX</h3>
            <p>Beautiful, responsive design with dark/light mode and smooth animations.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number gradient-text">1000+</div>
            <div className="stat-label">Appointments Booked</div>
          </div>
          <div className="stat-card">
            <div className="stat-number gradient-text">99.9%</div>
            <div className="stat-label">Uptime Guaranteed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number gradient-text">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-number gradient-text">100%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Schedule Your Appointment?</h2>
          <p>Join thousands of satisfied users who trust our platform</p>
          <Link to="/book" className="btn btn-primary btn-large">
            <FaCalendarPlus /> Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

