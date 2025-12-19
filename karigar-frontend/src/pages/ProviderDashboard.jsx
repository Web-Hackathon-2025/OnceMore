import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthService from '../services/authService';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    rating: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      if (currentUser.role !== 'service_provider') {
        navigate('/dashboard');
        return;
      }

      setUser(currentUser);

      // Fetch provider profile
      const profileResponse = await AuthService.getProfile();
      if (profileResponse.success) {
        setUser(profileResponse.user);
      }

      // Mock stats for now (You'll need to create backend APIs for provider stats)
      setStats({
        totalBookings: 45,
        pendingBookings: 3,
        completedBookings: 42,
        totalEarnings: 85600,
        rating: 4.8
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <div className="welcome-content">
              <h1>Welcome, {user?.name}! 👷‍♂️</h1>
              <p>Manage your service business efficiently</p>
            </div>
            <div className="welcome-actions">
              <button className="btn btn-primary">
                Update Availability
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total-bookings">
                📅
              </div>
              <div className="stat-content">
                <h3>{stats.totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                ⏳
              </div>
              <div className="stat-content">
                <h3>{stats.pendingBookings}</h3>
                <p>Pending Requests</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon completed">
                ✅
              </div>
              <div className="stat-content">
                <h3>{stats.completedBookings}</h3>
                <p>Completed Jobs</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon earnings">
                💰
              </div>
              <div className="stat-content">
                <h3>₹{stats.totalEarnings.toLocaleString()}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <Link to="/provider/bookings" className="action-card">
                <div className="action-icon bookings">
                  📋
                </div>
                <h3>Manage Bookings</h3>
                <p>View and update bookings</p>
              </Link>

              <Link to="/provider/profile" className="action-card">
                <div className="action-icon profile">
                  👤
                </div>
                <h3>Profile</h3>
                <p>Update your service details</p>
              </Link>

              <div className="action-card">
                <div className="action-icon schedule">
                  📅
                </div>
                <h3>Schedule</h3>
                <p>Set your availability</p>
              </div>

              <div className="action-card">
                <div className="action-icon earnings">
                  💰
                </div>
                <h3>Earnings</h3>
                <p>View payments and invoices</p>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Recent Bookings */}
            <div className="recent-bookings-section">
              <div className="section-header">
                <h2>Recent Bookings</h2>
                <Link to="/provider/bookings" className="view-all">
                  View All →
                </Link>
              </div>

              <div className="bookings-table">
                <div className="table-header">
                  <div className="table-cell">Customer</div>
                  <div className="table-cell">Service</div>
                  <div className="table-cell">Date & Time</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Amount</div>
                </div>

                {/* Mock data - you'll need to fetch real data */}
                {[
                  { id: 1, customer: 'John Doe', service: 'Electrical Repair', date: 'Today', time: '2:00 PM', status: 'Pending', amount: 1500 },
                  { id: 2, customer: 'Jane Smith', service: 'Plumbing', date: 'Tomorrow', time: '10:00 AM', status: 'Confirmed', amount: 2000 },
                  { id: 3, customer: 'Bob Wilson', service: 'Carpentry', date: 'Dec 20', time: '3:30 PM', status: 'Completed', amount: 3500 },
                ].map((booking) => (
                  <div key={booking.id} className="table-row">
                    <div className="table-cell">
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {booking.customer.charAt(0)}
                        </div>
                        <div className="customer-name">
                          {booking.customer}
                        </div>
                      </div>
                    </div>
                    <div className="table-cell">
                      <div className="service-cell">
                        {booking.service}
                      </div>
                    </div>
                    <div className="table-cell">
                      <div className="datetime-cell">
                        <div className="date">{booking.date}</div>
                        <div className="time">{booking.time}</div>
                      </div>
                    </div>
                    <div className="table-cell">
                      <span className={`badge ${booking.status === 'Completed' ? 'badge-success' : booking.status === 'Confirmed' ? 'badge-primary' : 'badge-warning'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="table-cell">
                      <div className="amount">
                        ₹{booking.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="profile-summary-section">
              <div className="summary-card">
                <div className="summary-header">
                  <h2>Profile Summary</h2>
                  <Link to="/provider/profile" className="btn btn-outline btn-sm">
                    Edit
                  </Link>
                </div>
                
                <div className="profile-summary-content">
                  <div className="profile-avatar-large">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="profile-details">
                    <h3>{user?.name}</h3>
                    <div className="profile-rating">
                      {'★'.repeat(Math.floor(stats.rating))}
                      {'☆'.repeat(5 - Math.floor(stats.rating))}
                      <span> ({stats.rating})</span>
                    </div>
                    
                    <div className="profile-info">
                      <div className="info-item">
                        <span className="label">Service Type:</span>
                        <span className="value">{user?.serviceType || 'Not set'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Experience:</span>
                        <span className="value">{user?.experience || 0} years</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Hourly Rate:</span>
                        <span className="value">₹{user?.hourlyRate || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderDashboard;