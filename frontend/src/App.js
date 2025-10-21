import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSun, FaMoon, FaRocket, FaCalendarAlt, FaCog } from 'react-icons/fa';
import './App.css';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/HomePage';
import AppointmentTimeline from './components/AppointmentTimeline';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <div className="App">
        {/* Animated Background */}
        <div className="background-animation">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <FaRocket className="logo-icon" />
              <span className="logo-text">Futuristic Scheduler</span>
            </Link>
            
            <div className="nav-menu">
              <Link to="/" className="nav-link">
                <FaCalendarAlt /> Home
              </Link>
              <Link to="/book" className="nav-link">
                <FaCalendarAlt /> Book Appointment
              </Link>
              <Link to="/admin" className="nav-link">
                <FaCog /> Admin Dashboard
              </Link>
              <Link to="/timeline" className="nav-link">
                <FaCalendarAlt /> Timeline
              </Link>
              <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<BookingForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/timeline" element={<AppointmentTimeline />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© 2025 Futuristic Appointment Scheduler. All rights reserved.</p>
        </footer>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
        />
      </div>
    </Router>
  );
}

export default App;

