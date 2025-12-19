import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AuthService from '../services/authService';
import ServiceService from '../services/serviceService';
import BookingService from '../services/bookingService';
import '../index.css';
=======
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthService from '../services/authService';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './ProviderDashboard.css';
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedJobs: 0,
    pendingRequests: 0,
    totalEarnings: 0
  });

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    serviceType: '',
    title: '',
    description: '',
    price: '',
    priceType: 'fixed',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    experience: '',
    availability: {
      monday: { available: false, startTime: '09:00', endTime: '18:00' },
      tuesday: { available: false, startTime: '09:00', endTime: '18:00' },
      wednesday: { available: false, startTime: '09:00', endTime: '18:00' },
      thursday: { available: false, startTime: '09:00', endTime: '18:00' },
      friday: { available: false, startTime: '09:00', endTime: '18:00' },
      saturday: { available: false, startTime: '09:00', endTime: '18:00' },
      sunday: { available: false, startTime: '09:00', endTime: '18:00' }
    }
  });
  const [editingService, setEditingService] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);

  // Booking actions state
  const [rescheduleForm, setRescheduleForm] = useState({
    bookingId: null,
    scheduledDate: '',
    scheduledTime: ''
  });
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser || currentUser.role !== 'service_provider') {
=======
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
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68
        navigate('/dashboard');
        return;
      }

      setUser(currentUser);
<<<<<<< HEAD
      
      try {
        await Promise.all([
          fetchServices(),
          fetchBookings(),
          fetchBookingHistory()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const response = await ServiceService.getMyServices();
      if (response.success) {
        setServices(response.services || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await BookingService.getProviderBookings();
      if (response.success) {
        setBookings(response.bookings || []);
        updateStats(response.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const response = await BookingService.getBookingHistory();
      if (response.success) {
        setBookingHistory(response.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching booking history:', error);
    }
  };

  const updateStats = (bookingsData) => {
    const active = bookingsData.filter(b => ['accepted', 'in_progress'].includes(b.status)).length;
    const completed = bookingsData.filter(b => b.status === 'completed').length;
    const pending = bookingsData.filter(b => b.status === 'pending').length;
    const earnings = bookingsData
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.price || 0), 0);

    setStats({
      activeJobs: active,
      completedJobs: completed,
      pendingRequests: pending,
      totalEarnings: earnings
    });
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...serviceForm,
        price: parseFloat(serviceForm.price),
        experience: parseInt(serviceForm.experience) || 0
      };

      if (editingService) {
        await ServiceService.updateService(editingService._id, serviceData);
      } else {
        await ServiceService.createService(serviceData);
      }

      await fetchServices();
      resetServiceForm();
      setShowServiceForm(false);
    } catch (error) {
      console.error('Error saving service:', error);
      alert(error.message || 'Error saving service');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      serviceType: service.serviceType || '',
      title: service.title || '',
      description: service.description || '',
      price: service.price || '',
      priceType: service.priceType || 'fixed',
      location: service.location || {
        address: '',
        city: '',
        state: '',
        pincode: ''
      },
      experience: service.experience || '',
      availability: service.availability || {
        monday: { available: false, startTime: '09:00', endTime: '18:00' },
        tuesday: { available: false, startTime: '09:00', endTime: '18:00' },
        wednesday: { available: false, startTime: '09:00', endTime: '18:00' },
        thursday: { available: false, startTime: '09:00', endTime: '18:00' },
        friday: { available: false, startTime: '09:00', endTime: '18:00' },
        saturday: { available: false, startTime: '09:00', endTime: '18:00' },
        sunday: { available: false, startTime: '09:00', endTime: '18:00' }
      }
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await ServiceService.deleteService(serviceId);
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert(error.message || 'Error deleting service');
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      serviceType: '',
      title: '',
      description: '',
      price: '',
      priceType: 'fixed',
      location: {
        address: '',
        city: '',
        state: '',
        pincode: ''
      },
      experience: '',
      availability: {
        monday: { available: false, startTime: '09:00', endTime: '18:00' },
        tuesday: { available: false, startTime: '09:00', endTime: '18:00' },
        wednesday: { available: false, startTime: '09:00', endTime: '18:00' },
        thursday: { available: false, startTime: '09:00', endTime: '18:00' },
        friday: { available: false, startTime: '09:00', endTime: '18:00' },
        saturday: { available: false, startTime: '09:00', endTime: '18:00' },
        sunday: { available: false, startTime: '09:00', endTime: '18:00' }
      }
    });
    setEditingService(null);
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await BookingService.acceptBooking(bookingId);
      await fetchBookings();
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert(error.message || 'Error accepting booking');
    }
  };

  const handleRejectBooking = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await BookingService.rejectBooking(selectedBookingId, rejectReason);
      await fetchBookings();
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedBookingId(null);
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert(error.message || 'Error rejecting booking');
    }
  };

  const handleRescheduleBooking = async () => {
    if (!rescheduleForm.scheduledDate || !rescheduleForm.scheduledTime) {
      alert('Please provide both date and time');
      return;
    }

    try {
      await BookingService.rescheduleBooking(
        rescheduleForm.bookingId,
        rescheduleForm.scheduledDate,
        rescheduleForm.scheduledTime
      );
      await fetchBookings();
      setRescheduleForm({ bookingId: null, scheduledDate: '', scheduledTime: '' });
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      alert(error.message || 'Error rescheduling booking');
=======

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
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

<<<<<<< HEAD
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'services', label: 'My Services', icon: '🔧' },
    { id: 'requests', label: 'Service Requests', icon: '📋' },
    { id: 'history', label: 'Booking History', icon: '📅' }
  ];

=======
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68
  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {/* Welcome Section */}
<<<<<<< HEAD
          <div className="card mb-4">
            <div className="d-flex justify-between align-center">
              <div>
                <h1 className="card-title">Welcome back, {user.name}! 👋</h1>
                <p className="text-muted">
                  Manage your services, bookings, and grow your business.
                </p>
              </div>
              <div className="d-flex gap-2">
                <span className="badge badge-secondary">Service Provider</span>
                {user.serviceType && (
                  <span className="badge badge-outline">{user.serviceType}</span>
                )}
              </div>
=======
          <div className="dashboard-welcome">
            <div className="welcome-content">
              <h1>Welcome, {user?.name}! 👷‍♂️</h1>
              <p>Manage your service business efficiently</p>
            </div>
            <div className="welcome-actions">
              <button className="btn btn-primary">
                Update Availability
              </button>
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68
            </div>
          </div>

          {/* Stats Grid */}
<<<<<<< HEAD
          <div className="stats-grid mb-4">
            <div className="stat-card">
              <div className="stat-icon primary">📊</div>
              <div className="stat-content">
                <h3>{stats.activeJobs}</h3>
                <p>Active Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon secondary">✅</div>
              <div className="stat-content">
                <h3>{stats.completedJobs}</h3>
                <p>Completed Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning">⏳</div>
              <div className="stat-content">
                <h3>{stats.pendingRequests}</h3>
                <p>Pending Requests</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon danger">💰</div>
=======
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
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68
              <div className="stat-content">
                <h3>₹{stats.totalEarnings.toLocaleString()}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Tabs */}
          <div className="card mb-4">
            <div className="tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="row">
              <div className="col-8">
                <div className="card">
                  <h2 className="card-title mb-3">Recent Activity</h2>
                  <div className="activity-list">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="activity-item">
                        <div className="activity-icon">
                          {booking.status === 'pending' && '⏳'}
                          {booking.status === 'accepted' && '✅'}
                          {booking.status === 'rejected' && '❌'}
                          {booking.status === 'completed' && '🎉'}
                        </div>
                        <div className="activity-content">
                          <h4>
                            {booking.status === 'pending' && 'New booking request'}
                            {booking.status === 'accepted' && 'Booking accepted'}
                            {booking.status === 'rejected' && 'Booking rejected'}
                            {booking.status === 'completed' && 'Service completed'}
                          </h4>
                          <p className="text-muted">
                            {booking.customer?.name} - {booking.service?.title || booking.serviceType}
                            {' • '}
                            {new Date(booking.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p className="text-muted text-center">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card">
                  <h2 className="card-title mb-3">Quick Stats</h2>
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-label">Total Services:</span>
                      <span className="detail-value">{services.length}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Active Services:</span>
                      <span className="detail-value">
                        {services.filter(s => s.isActive).length}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Bookings:</span>
                      <span className="detail-value">{bookings.length}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Avg. Rating:</span>
                      <span className="detail-value">
                        {services.length > 0
                          ? (services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length).toFixed(1)
                          : '0.0'}
                      </span>
=======
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
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68
                    </div>
                  </div>
                </div>
              </div>
            </div>
<<<<<<< HEAD
          )}

          {activeTab === 'services' && (
            <div className="card">
              <div className="d-flex justify-between align-center mb-3">
                <h2 className="card-title">My Services</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    resetServiceForm();
                    setShowServiceForm(true);
                  }}
                >
                  + Add Service
                </button>
              </div>

              {showServiceForm && (
                <div className="card mb-4" style={{ background: '#f9fafb' }}>
                  <h3 className="card-title mb-3">
                    {editingService ? 'Edit Service' : 'Create New Service'}
                  </h3>
                  <form onSubmit={handleServiceSubmit}>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label className="form-label">Service Type *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={serviceForm.serviceType}
                            onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                            required
                            placeholder="e.g., Plumber, Electrician"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label className="form-label">Title *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            required
                            placeholder="Service title"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        required
                        placeholder="Describe your service..."
                      />
                    </div>
                    <div className="row">
                      <div className="col-4">
                        <div className="form-group">
                          <label className="form-label">Price *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          <label className="form-label">Price Type *</label>
                          <select
                            className="form-control"
                            value={serviceForm.priceType}
                            onChange={(e) => setServiceForm({ ...serviceForm, priceType: e.target.value })}
                            required
                          >
                            <option value="fixed">Fixed</option>
                            <option value="hourly">Hourly</option>
                            <option value="per_service">Per Service</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          <label className="form-label">Experience (years)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={serviceForm.experience}
                            onChange={(e) => setServiceForm({ ...serviceForm, experience: e.target.value })}
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <div className="row">
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Address"
                            value={serviceForm.location.address}
                            onChange={(e) => setServiceForm({
                              ...serviceForm,
                              location: { ...serviceForm.location, address: e.target.value }
                            })}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="City"
                            value={serviceForm.location.city}
                            onChange={(e) => setServiceForm({
                              ...serviceForm,
                              location: { ...serviceForm.location, city: e.target.value }
                            })}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="State"
                            value={serviceForm.location.state}
                            onChange={(e) => setServiceForm({
                              ...serviceForm,
                              location: { ...serviceForm.location, state: e.target.value }
                            })}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Pincode"
                            value={serviceForm.location.pincode}
                            onChange={(e) => setServiceForm({
                              ...serviceForm,
                              location: { ...serviceForm.location, pincode: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Availability</label>
                      <div className="availability-grid">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                          <div key={day} className="availability-day">
                            <label className="d-flex align-center gap-2">
                              <input
                                type="checkbox"
                                checked={serviceForm.availability[day].available}
                                onChange={(e) => setServiceForm({
                                  ...serviceForm,
                                  availability: {
                                    ...serviceForm.availability,
                                    [day]: {
                                      ...serviceForm.availability[day],
                                      available: e.target.checked
                                    }
                                  }
                                })}
                              />
                              <span style={{ textTransform: 'capitalize', minWidth: '80px' }}>{day}</span>
                            </label>
                            {serviceForm.availability[day].available && (
                              <div className="d-flex gap-2 mt-2">
                                <input
                                  type="time"
                                  className="form-control"
                                  value={serviceForm.availability[day].startTime}
                                  onChange={(e) => setServiceForm({
                                    ...serviceForm,
                                    availability: {
                                      ...serviceForm.availability,
                                      [day]: {
                                        ...serviceForm.availability[day],
                                        startTime: e.target.value
                                      }
                                    }
                                  })}
                                />
                                <input
                                  type="time"
                                  className="form-control"
                                  value={serviceForm.availability[day].endTime}
                                  onChange={(e) => setServiceForm({
                                    ...serviceForm,
                                    availability: {
                                      ...serviceForm.availability,
                                      [day]: {
                                        ...serviceForm.availability[day],
                                        endTime: e.target.value
                                      }
                                    }
                                  })}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        {editingService ? 'Update Service' : 'Create Service'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setShowServiceForm(false);
                          resetServiceForm();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="services-list">
                {services.length === 0 ? (
                  <p className="text-muted text-center">No services yet. Create your first service!</p>
                ) : (
                  services.map(service => (
                    <div key={service._id} className="service-item">
                      <div className="service-content">
                        <h3>{service.title}</h3>
                        <p className="text-muted">{service.description}</p>
                        <div className="d-flex gap-2 mt-2">
                          <span className="badge badge-primary">
                            {service.serviceType}
                          </span>
                          <span className="badge badge-outline">
                            ₹{service.price} ({service.priceType})
                          </span>
                          {service.isActive ? (
                            <span className="badge badge-secondary">Active</span>
                          ) : (
                            <span className="badge badge-outline">Inactive</span>
                          )}
                        </div>
                      </div>
                      <div className="service-actions">
                        <button
                          className="btn btn-outline"
                          onClick={() => handleEditService(service)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteService(service._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="card">
              <h2 className="card-title mb-3">Service Requests</h2>
              <div className="bookings-list">
                {bookings.filter(b => ['pending', 'accepted', 'rescheduled'].includes(b.status)).length === 0 ? (
                  <p className="text-muted text-center">No service requests</p>
                ) : (
                  bookings
                    .filter(b => ['pending', 'accepted', 'rescheduled'].includes(b.status))
                    .map(booking => (
                      <div key={booking._id} className="booking-item">
                        <div className="booking-content">
                          <h3>{booking.service?.title || booking.serviceType}</h3>
                          <p className="text-muted">
                            <strong>Customer:</strong> {booking.customer?.name} ({booking.customer?.email})
                          </p>
                          <p className="text-muted">
                            <strong>Phone:</strong> {booking.phone}
                          </p>
                          <p className="text-muted">
                            <strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}
                            {' • '}
                            <strong>Time:</strong> {booking.scheduledTime}
                          </p>
                          {booking.status === 'rescheduled' && (
                            <p className="text-muted">
                              <strong>Rescheduled to:</strong> {new Date(booking.rescheduledDate).toLocaleDateString()}
                              {' • '}
                              {booking.rescheduledTime}
                            </p>
                          )}
                          <p className="text-muted">
                            <strong>Address:</strong> {booking.address}, {booking.city} - {booking.pincode}
                          </p>
                          {booking.description && (
                            <p className="text-muted">
                              <strong>Description:</strong> {booking.description}
                            </p>
                          )}
                          <p className="text-muted">
                            <strong>Price:</strong> ₹{booking.price}
                          </p>
                          <span className={`badge ${booking.status === 'pending' ? 'badge-warning' : booking.status === 'accepted' ? 'badge-secondary' : 'badge-info'}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="booking-actions">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleAcceptBooking(booking._id)}
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  setSelectedBookingId(booking._id);
                                  setShowRejectModal(true);
                                }}
                              >
                                Reject
                              </button>
                              <button
                                className="btn btn-outline"
                                onClick={() => {
                                  setRescheduleForm({
                                    bookingId: booking._id,
                                    scheduledDate: booking.scheduledDate.split('T')[0],
                                    scheduledTime: booking.scheduledTime
                                  });
                                }}
                              >
                                Reschedule
                              </button>
                            </>
                          )}
                          {booking.status === 'rescheduled' && rescheduleForm.bookingId === booking._id && (
                            <div className="reschedule-form">
                              <div className="row">
                                <div className="col-6">
                                  <input
                                    type="date"
                                    className="form-control mb-2"
                                    value={rescheduleForm.scheduledDate}
                                    onChange={(e) => setRescheduleForm({
                                      ...rescheduleForm,
                                      scheduledDate: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="col-6">
                                  <input
                                    type="time"
                                    className="form-control mb-2"
                                    value={rescheduleForm.scheduledTime}
                                    onChange={(e) => setRescheduleForm({
                                      ...rescheduleForm,
                                      scheduledTime: e.target.value
                                    })}
                                  />
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-primary"
                                  onClick={handleRescheduleBooking}
                                >
                                  Confirm Reschedule
                                </button>
                                <button
                                  className="btn btn-outline"
                                  onClick={() => setRescheduleForm({ bookingId: null, scheduledDate: '', scheduledTime: '' })}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="card">
              <h2 className="card-title mb-3">Booking History</h2>
              <div className="bookings-list">
                {bookingHistory.length === 0 ? (
                  <p className="text-muted text-center">No booking history</p>
                ) : (
                  bookingHistory.map(booking => (
                    <div key={booking._id} className="booking-item">
                      <div className="booking-content">
                        <h3>{booking.service?.title || booking.serviceType}</h3>
                        <p className="text-muted">
                          <strong>Customer:</strong> {booking.customer?.name}
                        </p>
                        <p className="text-muted">
                          <strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}
                          {' • '}
                          <strong>Time:</strong> {booking.scheduledTime}
                        </p>
                        <p className="text-muted">
                          <strong>Address:</strong> {booking.address}, {booking.city}
                        </p>
                        <p className="text-muted">
                          <strong>Price:</strong> ₹{booking.price}
                        </p>
                        {booking.rating && (
                          <p className="text-muted">
                            <strong>Rating:</strong> {'⭐'.repeat(booking.rating)} ({booking.rating}/5)
                          </p>
                        )}
                        {booking.review && (
                          <p className="text-muted">
                            <strong>Review:</strong> {booking.review}
                          </p>
                        )}
                        <span className={`badge ${booking.status === 'completed' ? 'badge-secondary' : 'badge-danger'}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Reject Modal */}
          {showRejectModal && (
            <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="card-title mb-3">Reject Booking</h3>
                <div className="form-group">
                  <label className="form-label">Reason for Rejection *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this booking..."
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-danger" onClick={handleRejectBooking}>
                    Confirm Rejection
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                      setSelectedBookingId(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
=======
          </div>
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68
        </div>
      </main>

      <Footer />
    </div>
  );
};

<<<<<<< HEAD
export default ProviderDashboard;

=======
export default ProviderDashboard;
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68
