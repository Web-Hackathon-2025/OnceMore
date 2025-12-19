import React from 'react'
import Navbar from '../components/Layout/Navbar'
import { Link } from 'react-router-dom'
import { 
  FiCalendar, FiDollarSign, FiTrendingUp, FiUsers, 
  FiClock, FiAlertCircle, FiArrowRight, FiBriefcase
} from 'react-icons/fi'
import './ProviderDashboard.css'

const ProviderDashboard = () => {
  // Mock data - replace with API calls
  const stats = {
    totalEarnings: 12500,
    pendingBookings: 5,
    completedServices: 48,
    averageRating: 4.8
  }

  const recentBookings = [
    {
      id: 1,
      customerName: 'Sarah M.',
      service: 'Pipe Repair',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      amount: '$150'
    },
    {
      id: 2,
      customerName: 'Mike T.',
      service: 'Drain Cleaning',
      date: '2024-01-16',
      time: '2:00 PM',
      status: 'pending',
      amount: '$100'
    },
    {
      id: 3,
      customerName: 'Lisa K.',
      service: 'Water Heater Installation',
      date: '2024-01-17',
      time: '9:00 AM',
      status: 'pending',
      amount: '$500'
    }
  ]

  const upcomingSchedule = [
    { date: 'Today', time: '10:00 AM', service: 'Pipe Repair', customer: 'Sarah M.' },
    { date: 'Today', time: '2:00 PM', service: 'Leak Detection', customer: 'John D.' },
    { date: 'Tomorrow', time: '9:00 AM', service: 'Drain Cleaning', customer: 'Mike T.' },
    { date: 'Jan 18', time: '11:00 AM', service: 'Fixture Installation', customer: 'Emma W.' }
  ]

  return (
    <div className="provider-dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, John!</h1>
            <p>Here's what's happening with your business today</p>
          </div>
          <div className="header-actions">
            <Link to="/bookings" className="btn-secondary">
              View All Bookings
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card earnings">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Earnings</p>
              <h3>${stats.totalEarnings.toLocaleString()}</h3>
              <span className="stat-change positive">
                <FiTrendingUp /> +12% from last month
              </span>
            </div>
          </div>

          <div className="stat-card bookings">
            <div className="stat-icon">
              <FiCalendar />
            </div>
            <div className="stat-content">
              <p className="stat-label">Pending Bookings</p>
              <h3>{stats.pendingBookings}</h3>
              <span className="stat-change">Requires attention</span>
            </div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-content">
              <p className="stat-label">Completed Services</p>
              <h3>{stats.completedServices}</h3>
              <span className="stat-change positive">This month</span>
            </div>
          </div>

          <div className="stat-card rating">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <p className="stat-label">Average Rating</p>
              <h3>{stats.averageRating}</h3>
              <span className="stat-change positive">Based on 124 reviews</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Bookings</h2>
              <Link to="/bookings" className="link-text">View All <FiArrowRight /></Link>
            </div>
            <div className="bookings-list">
              {recentBookings.map(booking => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-info">
                    <h4>{booking.customerName}</h4>
                    <p className="service-name">{booking.service}</p>
                    <div className="booking-meta">
                      <span>{booking.date}</span>
                      <span>•</span>
                      <span>{booking.time}</span>
                    </div>
                  </div>
                  <div className="booking-right">
                    <div className="booking-amount">{booking.amount}</div>
                    <div className={`booking-status ${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Upcoming Schedule</h2>
              <Link to="/availability" className="link-text">Manage <FiArrowRight /></Link>
            </div>
            <div className="schedule-list">
              {upcomingSchedule.map((item, index) => (
                <div key={index} className="schedule-item">
                  <div className="schedule-time">
                    <FiClock />
                    <div>
                      <strong>{item.time}</strong>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <div className="schedule-details">
                    <h4>{item.service}</h4>
                    <p>{item.customer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/services" className="action-card">
              <FiBriefcase />
              <h3>Manage Services</h3>
              <p>Add or edit your service offerings</p>
            </Link>
            <Link to="/bookings" className="action-card">
              <FiCalendar />
              <h3>View Bookings</h3>
              <p>Check and manage all bookings</p>
            </Link>
            <Link to="/availability" className="action-card">
              <FiClock />
              <h3>Set Availability</h3>
              <p>Update your working hours</p>
            </Link>
            <Link to="/earnings" className="action-card">
              <FiDollarSign />
              <h3>View Earnings</h3>
              <p>Track your revenue and analytics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderDashboard

