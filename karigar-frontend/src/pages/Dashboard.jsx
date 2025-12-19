import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './Dashboard.css';
import AuthService from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // If user is a service provider, redirect to provider dashboard
      if (currentUser.role === 'service_provider') {
        navigate('/provider-dashboard');
        return;
      }

      setUser(currentUser);
      
      // Fetch additional user data if needed
      try {
        const response = await AuthService.getProfile();
        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }

      // Set stats for customers
      setStats({
        bookings: 8,
        servicesUsed: 24,
        saved: 6,
        inProgress: 2
      });

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {/* Welcome Section */}
          <div className="card mb-4">
            <div className="d-flex justify-between align-center">
              <div>
                <h1 className="card-title">Welcome back, {user.name}! 👋</h1>
                <p className="text-muted">
                  Find the best service providers for your needs.
                </p>
              </div>
              <div className="d-flex gap-2">
                <span className="badge badge-primary">Customer</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid mb-4">
            <div className="stat-card">
              <div className="stat-icon primary">📅</div>
              <div className="stat-content">
                <h3>{stats.bookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon secondary">🔧</div>
              <div className="stat-content">
                <h3>{stats.servicesUsed}</h3>
                <p>Services Used</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon warning">⭐</div>
              <div className="stat-content">
                <h3>{stats.saved}</h3>
                <p>Saved Providers</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon danger">⏳</div>
              <div className="stat-content">
                <h3>{stats.inProgress}</h3>
                <p>In Progress</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mb-4">
            <h2 className="card-title mb-3">Quick Actions</h2>
            <div className="row">
              <div className="col-3">
                <button className="btn btn-outline w-100">
                  🔍 Find Services
                </button>
              </div>
              <div className="col-3">
                <button className="btn btn-outline w-100">
                  📅 My Bookings
                </button>
              </div>
              <div className="col-3">
                <button className="btn btn-outline w-100">
                  💬 Messages
                </button>
              </div>
              <div className="col-3">
                <button className="btn btn-outline w-100">
                  ⭐ Reviews
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="row">
            <div className="col-8">
              <div className="card">
                <h2 className="card-title mb-3">Recent Activity</h2>
                <div className="activity-list">
                  {[
                    { id: 1, title: 'New booking received', time: '2 hours ago', type: 'booking' },
                    { id: 2, title: 'Payment received', time: '1 day ago', type: 'payment' },
                    { id: 3, title: 'Service completed', time: '2 days ago', type: 'service' },
                    { id: 4, title: 'New review received', time: '3 days ago', type: 'review' },
                  ].map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === 'booking' && '📖'}
                        {activity.type === 'payment' && '💰'}
                        {activity.type === 'service' && '🔧'}
                        {activity.type === 'review' && '⭐'}
                      </div>
                      <div className="activity-content">
                        <h4>{activity.title}</h4>
                        <p className="text-muted">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="card">
                <h2 className="card-title mb-3">Profile Summary</h2>
                <div className="profile-summary">
                  <div className="profile-avatar-small">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>{user.name}</h3>
                  <p className="text-muted">{user.email}</p>
                  
                  <div className="profile-details mt-3">
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{user.phone || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Member since:</span>
                      <span className="detail-value">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/profile')}
                    className="btn btn-primary w-100 mt-3"
                  >
                    Edit Profile
                  </button>
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

export default Dashboard;

