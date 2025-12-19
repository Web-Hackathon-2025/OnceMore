import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthService from '../services/authService';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './CustomerProfile.css';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    favoriteService: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Get user profile
      const response = await AuthService.getProfile();
      if (response.success) {
        setUser(response.user);
        setFormData({
          name: response.user.name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          address: response.user.address || {
            street: '',
            city: '',
            state: '',
            pincode: ''
          }
        });
      }

      // Get user stats
      const bookingsResponse = await api.get('/bookings/my-bookings');
      if (bookingsResponse.success) {
        const bookings = bookingsResponse.bookings;
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const totalSpent = bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, booking) => sum + (booking.pricing?.finalAmount || 0), 0);

        // Find favorite service
        const serviceCounts = {};
        bookings.forEach(booking => {
          serviceCounts[booking.serviceType] = (serviceCounts[booking.serviceType] || 0) + 1;
        });
        
        let favoriteService = '';
        let maxCount = 0;
        Object.entries(serviceCounts).forEach(([service, count]) => {
          if (count > maxCount) {
            maxCount = count;
            favoriteService = service;
          }
        });

        setStats({
          totalBookings,
          completedBookings,
          totalSpent,
          favoriteService: favoriteService || 'None'
        });
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await AuthService.updateProfile(formData);
      
      if (response.success) {
        setUser(response.user);
        setSuccess('Profile updated successfully!');
        setEditing(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = () => {
    // Implement password change functionality
    alert('Password change feature will be implemented soon!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion feature will be implemented soon!');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      
      <div className="profile-header">
        <div className="container">
          <div className="profile-avatar-large">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="profile-name">{user?.name}</h1>
          <div className="profile-role">Customer</div>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          <div className="profile-container">
            {/* Left Sidebar */}
            <div className="profile-sidebar">
              <div className="sidebar-card">
                <div className="sidebar-stats">
                  <div className="stat-item">
                    <div className="stat-icon">📅</div>
                    <div>
                      <div className="stat-value">{stats.totalBookings}</div>
                      <div className="stat-label">Total Bookings</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon">✅</div>
                    <div>
                      <div className="stat-value">{stats.completedBookings}</div>
                      <div className="stat-label">Completed</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon">💰</div>
                    <div>
                      <div className="stat-value">₹{stats.totalSpent.toLocaleString()}</div>
                      <div className="stat-label">Total Spent</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon">⭐</div>
                    <div>
                      <div className="stat-value">{stats.favoriteService}</div>
                      <div className="stat-label">Favorite Service</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidebar-menu">
                <button
                  className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <span className="menu-icon">👤</span>
                  Profile Information
                </button>
                <button
                  className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <span className="menu-icon">📋</span>
                  My Bookings
                </button>
                <button
                  className={`menu-item ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  <span className="menu-icon">⭐</span>
                  My Reviews
                </button>
                <button
                  className={`menu-item ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <span className="menu-icon">🔒</span>
                  Security
                </button>
                <button
                  className={`menu-item ${activeTab === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  <span className="menu-icon">⚙️</span>
                  Preferences
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="profile-content">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="tab-content-card">
                  <div className="tab-header">
                    <h2>Profile Information</h2>
                    <button
                      onClick={() => setEditing(!editing)}
                      className="btn btn-outline"
                    >
                      {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="tab-body">
                    {error && (
                      <div className="alert alert-error">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="alert alert-success">
                        {success}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="profile-form">
                        <div className="form-section">
                          <h3>Personal Information</h3>
                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">Full Name</label>
                              <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!editing}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                value={formData.email}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              className="form-control"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!editing}
                            />
                          </div>
                        </div>

                        <div className="form-section">
                          <h3>Address</h3>
                          <div className="form-group">
                            <label className="form-label">Street Address</label>
                            <input
                              type="text"
                              name="address.street"
                              className="form-control"
                              value={formData.address.street}
                              onChange={handleInputChange}
                              disabled={!editing}
                            />
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">City</label>
                              <input
                                type="text"
                                name="address.city"
                                className="form-control"
                                value={formData.address.city}
                                onChange={handleInputChange}
                                disabled={!editing}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label className="form-label">State</label>
                              <input
                                type="text"
                                name="address.state"
                                className="form-control"
                                value={formData.address.state}
                                onChange={handleInputChange}
                                disabled={!editing}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label className="form-label">Pincode</label>
                              <input
                                type="text"
                                name="address.pincode"
                                className="form-control"
                                value={formData.address.pincode}
                                onChange={handleInputChange}
                                disabled={!editing}
                              />
                            </div>
                          </div>
                        </div>

                        {editing && (
                          <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                              Save Changes
                            </button>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="tab-content-card">
                  <div className="tab-header">
                    <h2>My Bookings</h2>
                    <button
                      onClick={() => navigate('/my-bookings')}
                      className="btn btn-primary"
                    >
                      View All Bookings
                    </button>
                  </div>

                  <div className="tab-body">
                    <p className="tab-description">
                      View and manage all your service bookings in one place.
                    </p>
                    
                    <div className="booking-stats">
                      <div className="stat-card-small">
                        <div className="stat-number">{stats.totalBookings}</div>
                        <div className="stat-label">Total Bookings</div>
                      </div>
                      <div className="stat-card-small">
                        <div className="stat-number">{stats.completedBookings}</div>
                        <div className="stat-label">Completed</div>
                      </div>
                      <div className="stat-card-small">
                        <div className="stat-number">₹{stats.totalSpent.toLocaleString()}</div>
                        <div className="stat-label">Total Spent</div>
                      </div>
                    </div>

                    <div className="tab-actions">
                      <button
                        onClick={() => navigate('/services')}
                        className="btn btn-primary"
                      >
                        Book New Service
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="tab-content-card">
                  <div className="tab-header">
                    <h2>My Reviews</h2>
                  </div>

                  <div className="tab-body">
                    <p className="tab-description">
                      Reviews you've submitted for completed services.
                    </p>
                    
                    <div className="reviews-placeholder">
                      <div className="placeholder-icon">⭐</div>
                      <h3>No Reviews Yet</h3>
                      <p>You haven't submitted any reviews. Reviews help other customers make informed decisions.</p>
                      <button
                        onClick={() => navigate('/my-bookings')}
                        className="btn btn-primary"
                      >
                        View Completed Bookings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="tab-content-card">
                  <div className="tab-header">
                    <h2>Security Settings</h2>
                  </div>

                  <div className="tab-body">
                    <div className="security-settings">
                      <div className="security-item">
                        <div className="security-info">
                          <h3>Change Password</h3>
                          <p>Update your password regularly to keep your account secure</p>
                        </div>
                        <button
                          onClick={handleChangePassword}
                          className="btn btn-outline"
                        >
                          Change Password
                        </button>
                      </div>

                      <div className="security-item">
                        <div className="security-info">
                          <h3>Two-Factor Authentication</h3>
                          <p>Add an extra layer of security to your account</p>
                        </div>
                        <button className="btn btn-outline" disabled>
                          Coming Soon
                        </button>
                      </div>

                      <div className="security-item">
                        <div className="security-info">
                          <h3>Login Activity</h3>
                          <p>Review your recent login history and devices</p>
                        </div>
                        <button className="btn btn-outline" disabled>
                          View Activity
                        </button>
                      </div>
                    </div>

                    <div className="danger-zone">
                      <h3>Danger Zone</h3>
                      <div className="danger-item">
                        <div>
                          <h4>Delete Account</h4>
                          <p>Permanently delete your account and all associated data</p>
                        </div>
                        <button
                          onClick={handleDeleteAccount}
                          className="btn btn-danger"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="tab-content-card">
                  <div className="tab-header">
                    <h2>Preferences</h2>
                  </div>

                  <div className="tab-body">
                    <div className="preferences-list">
                      <div className="preference-item">
                        <div className="preference-info">
                          <h3>Email Notifications</h3>
                          <p>Receive emails about your bookings and promotions</p>
                        </div>
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="preference-item">
                        <div className="preference-info">
                          <h3>SMS Notifications</h3>
                          <p>Get SMS alerts for booking updates</p>
                        </div>
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="preference-item">
                        <div className="preference-info">
                          <h3>Push Notifications</h3>
                          <p>Receive push notifications on your device</p>
                        </div>
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="preference-item">
                        <div className="preference-info">
                          <h3>Marketing Emails</h3>
                          <p>Receive promotional emails and offers</p>
                        </div>
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="preferences-actions">
                      <button className="btn btn-primary">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerProfile;