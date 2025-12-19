import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthService from '../services/authService';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recommendedProviders, setRecommendedProviders] = useState([]);
  const [loading, setLoading] = useState(true);

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

      setUser(currentUser);

      // Fetch bookings stats
      const bookingsResponse = await api.get('/bookings/my-bookings?limit=5');
      if (bookingsResponse.success) {
        setRecentBookings(bookingsResponse.bookings);
        
        // Calculate stats
        const allBookings = bookingsResponse.bookings;
        const totalBookings = allBookings.length;
        const pendingBookings = allBookings.filter(b => b.status === 'pending' || b.status === 'accepted').length;
        const completedBookings = allBookings.filter(b => b.status === 'completed').length;
        const totalSpent = allBookings
          .filter(b => b.status === 'completed')
          .reduce((sum, booking) => sum + (booking.pricing?.finalAmount || 0), 0);

        setStats({
          totalBookings,
          pendingBookings,
          completedBookings,
          totalSpent
        });
      }

      // Fetch recommended service providers
      const providersResponse = await api.get('/service-providers?limit=4&sortBy=rating');
      if (providersResponse.success) {
        setRecommendedProviders(providersResponse.serviceProviders);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', class: 'badge-warning' },
      accepted: { label: 'Accepted', class: 'badge-info' },
      rejected: { label: 'Rejected', class: 'badge-danger' },
      in_progress: { label: 'In Progress', class: 'badge-primary' },
      completed: { label: 'Completed', class: 'badge-success' },
      cancelled: { label: 'Cancelled', class: 'badge-secondary' }
    };

    const config = statusConfig[status] || { label: status, class: 'badge-secondary' };
    
    return (
      <span className={`badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
              <h1>Welcome back, {user?.name}! 👋</h1>
              <p>Here's what's happening with your services today</p>
            </div>
            <div className="welcome-actions">
              <Link to="/services" className="btn btn-primary">
                Book New Service
              </Link>
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
                <p>Services Completed</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon spent">
                💰
              </div>
              <div className="stat-content">
                <h3>₹{stats.totalSpent.toLocaleString()}</h3>
                <p>Total Spent</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <Link to="/services" className="action-card">
                <div className="action-icon find-service">
                  🔍
                </div>
                <h3>Find Services</h3>
                <p>Book a new service</p>
              </Link>

              <Link to="/my-bookings" className="action-card">
                <div className="action-icon bookings">
                  📋
                </div>
                <h3>My Bookings</h3>
                <p>Track your requests</p>
              </Link>

              <Link to="/profile" className="action-card">
                <div className="action-icon profile">
                  👤
                </div>
                <h3>Profile</h3>
                <p>Update your details</p>
              </Link>

              <div className="action-card">
                <div className="action-icon help">
                  ❓
                </div>
                <h3>Help Center</h3>
                <p>Get support</p>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Recent Bookings */}
            <div className="recent-bookings-section">
              <div className="section-header">
                <h2>Recent Bookings</h2>
                <Link to="/my-bookings" className="view-all">
                  View All →
                </Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="bookings-table">
                  <div className="table-header">
                    <div className="table-cell">Service</div>
                    <div className="table-cell">Provider</div>
                    <div className="table-cell">Date & Time</div>
                    <div className="table-cell">Status</div>
                    <div className="table-cell">Amount</div>
                    <div className="table-cell">Action</div>
                  </div>

                  {recentBookings.map((booking) => (
                    <div key={booking._id} className="table-row">
                      <div className="table-cell">
                        <div className="service-info">
                          <div className="service-icon">
                            {booking.serviceType === 'electrician' && '⚡'}
                            {booking.serviceType === 'plumber' && '🔧'}
                            {booking.serviceType === 'carpenter' && '🪚'}
                            {booking.serviceType === 'cleaner' && '🧹'}
                            {booking.serviceType === 'painter' && '🎨'}
                            {!['electrician', 'plumber', 'carpenter', 'cleaner', 'painter'].includes(booking.serviceType) && '🔨'}
                          </div>
                          <div>
                            <div className="service-name">{booking.serviceType}</div>
                            <div className="service-desc">{booking.description.substring(0, 30)}...</div>
                          </div>
                        </div>
                      </div>
                      <div className="table-cell">
                        <div className="provider-cell">
                          <div className="provider-avatar-small">
                            {booking.serviceProvider?.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="provider-name">
                            {booking.serviceProvider?.user?.name}
                          </div>
                        </div>
                      </div>
                      <div className="table-cell">
                        <div className="datetime-cell">
                          <div className="date">{formatDate(booking.schedule.date)}</div>
                          <div className="time">{formatTime(booking.schedule.timeSlot.start)}</div>
                        </div>
                      </div>
                      <div className="table-cell">
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="table-cell">
                        <div className="amount">
                          ₹{booking.pricing?.estimatedTotal || 'N/A'}
                        </div>
                      </div>
                      <div className="table-cell">
                        <Link to={`/bookings/${booking._id}`} className="btn btn-outline btn-sm">
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-bookings">
                  <p>You haven't made any bookings yet.</p>
                  <Link to="/services" className="btn btn-primary">
                    Book Your First Service
                  </Link>
                </div>
              )}
            </div>

            {/* Recommended Providers */}
            <div className="recommended-section">
              <div className="section-header">
                <h2>Recommended Service Providers</h2>
                <Link to="/services" className="view-all">
                  View All →
                </Link>
              </div>

              <div className="providers-grid">
                {recommendedProviders.map((provider) => (
                  <div key={provider._id} className="provider-card-small">
                    <div className="provider-header-small">
                      <div className="provider-avatar-small">
                        {provider.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="provider-info-small">
                        <h3>{provider.user?.name}</h3>
                        <div className="provider-rating-small">
                          <div className="stars">
                            {'★'.repeat(Math.floor(provider.rating.average))}
                            {'☆'.repeat(5 - Math.floor(provider.rating.average))}
                          </div>
                          <span className="rating-text">
                            {provider.rating.average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="provider-details-small">
                      <div className="detail-item">
                        <span className="detail-label">Service:</span>
                        <span className="detail-value">{provider.serviceType}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Experience:</span>
                        <span className="detail-value">{provider.experience} years</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Rate:</span>
                        <span className="detail-value price">₹{provider.hourlyRate}/hr</span>
                      </div>
                    </div>

                    <div className="provider-actions-small">
                      <Link 
                        to={`/service-providers/${provider._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View Profile
                      </Link>
                      <Link 
                        to={`/book-service/${provider._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {recommendedProviders.length === 0 && (
                <div className="no-providers">
                  <p>No service providers available at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-timeline">
              <div className="activity-item">
                <div className="activity-icon">📅</div>
                <div className="activity-content">
                  <h4>Welcome to Karigar!</h4>
                  <p>Your account was created successfully</p>
                  <span className="activity-time">Just now</span>
                </div>
              </div>
              
              {recentBookings.slice(0, 3).map((booking, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {booking.status === 'completed' ? '✅' : 
                     booking.status === 'cancelled' ? '❌' : '🔄'}
                  </div>
                  <div className="activity-content">
                    <h4>
                      {booking.status === 'completed' ? 'Service Completed' :
                       booking.status === 'cancelled' ? 'Booking Cancelled' :
                       'Booking Updated'}
                    </h4>
                    <p>{booking.serviceType} service</p>
                    <span className="activity-time">
                      {new Date(booking.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;