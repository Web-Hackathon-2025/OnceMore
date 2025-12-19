import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filters, pagination.page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: 10
      }).toString();

      const response = await api.get(`/bookings/my-bookings?${params}`);
      
      if (response.success) {
        setBookings(response.bookings);
        setPagination({
          page: response.currentPage,
          totalPages: response.totalPages,
          total: response.total
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await api.put(`/bookings/${bookingId}/status`, {
        status: 'cancelled',
        cancellationReason: 'Cancelled by customer'
      });

      if (response.success) {
        alert('Booking cancelled successfully');
        fetchBookings();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.message || 'Failed to cancel booking');
    }
  };

  const handleSendMessage = async (bookingId) => {
    if (!newMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      const response = await api.post(`/bookings/${bookingId}/messages`, {
        message: newMessage
      });

      if (response.success) {
        alert('Message sent successfully');
        setNewMessage('');
        // Refresh booking details
        const updatedBooking = bookings.find(b => b._id === bookingId);
        if (updatedBooking) {
          updatedBooking.messages = response.messages;
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.message || 'Failed to send message');
    }
  };

  const handleSubmitReview = (booking) => {
    if (!booking.review && booking.status === 'completed') {
      // Navigate to review page
      window.location.href = `/submit-review/${booking._id}`;
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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  if (loading && bookings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="bookings-header">
            <h1>My Bookings</h1>
            <p>Track and manage all your service requests</p>
          </div>

          {/* Filters */}
          <div className="bookings-filters">
            <div className="filter-group">
              <label>Filter by Status:</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bookings-container">
            {loading ? (
              <div className="loading-bookings">
                <div className="spinner"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-header">
                      <div className="booking-info">
                        <h3>{booking.serviceType}</h3>
                        <div className="booking-meta">
                          <span className="booking-date">
                            {formatDate(booking.schedule.date)}
                          </span>
                          <span className="booking-time">
                            {formatTime(booking.schedule.timeSlot.start)} - 
                            {formatTime(booking.schedule.timeSlot.end)}
                          </span>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                      
                      <div className="booking-actions">
                        <button
                          onClick={() => setSelectedBooking(
                            selectedBooking?._id === booking._id ? null : booking
                          )}
                          className="btn btn-outline"
                        >
                          {selectedBooking?._id === booking._id ? 'Hide Details' : 'View Details'}
                        </button>
                        
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="btn btn-danger"
                          >
                            Cancel
                          </button>
                        )}
                        
                        {booking.status === 'completed' && !booking.review && (
                          <button
                            onClick={() => handleSubmitReview(booking)}
                            className="btn btn-primary"
                          >
                            Submit Review
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="booking-provider">
                      <div className="provider-avatar">
                        {booking.serviceProvider?.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="provider-info">
                        <h4>{booking.serviceProvider?.user?.name}</h4>
                        <p className="provider-phone">
                          📞 {booking.serviceProvider?.user?.phone || 'Not provided'}
                        </p>
                      </div>
                      <div className="provider-rate">
                        <strong>₹{booking.pricing?.hourlyRate}/hour</strong>
                      </div>
                    </div>

                    <div className="booking-description">
                      <p>{booking.description}</p>
                    </div>

                    {/* Booking Details (Collapsible) */}
                    {selectedBooking?._id === booking._id && (
                      <div className="booking-details">
                        <div className="details-section">
                          <h4>Address</h4>
                          <p>
                            {booking.address?.street}, {booking.address?.city}, 
                            {booking.address?.state} {booking.address?.pincode}
                          </p>
                        </div>

                        <div className="details-section">
                          <h4>Pricing</h4>
                          <div className="pricing-details">
                            <div className="price-row">
                              <span>Hourly Rate:</span>
                              <span>₹{booking.pricing?.hourlyRate}/hour</span>
                            </div>
                            <div className="price-row">
                              <span>Estimated Hours:</span>
                              <span>{booking.schedule?.estimatedHours} hours</span>
                            </div>
                            <div className="price-row total">
                              <span>Estimated Total:</span>
                              <span>₹{booking.pricing?.estimatedTotal}</span>
                            </div>
                          </div>
                        </div>

                        <div className="details-section">
                          <h4>Status History</h4>
                          <div className="status-timeline">
                            {booking.statusHistory?.map((history, index) => (
                              <div key={index} className="status-item">
                                <div className="status-dot"></div>
                                <div className="status-content">
                                  <div className="status-name">{history.status}</div>
                                  <div className="status-date">
                                    {new Date(history.timestamp).toLocaleString()}
                                  </div>
                                  {history.note && (
                                    <div className="status-note">{history.note}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Messages Section */}
                        <div className="details-section">
                          <h4>Messages</h4>
                          <div className="messages-container">
                            {booking.messages?.length > 0 ? (
                              <div className="messages-list">
                                {booking.messages.map((msg, index) => (
                                  <div
                                    key={index}
                                    className={`message ${msg.sender === 'customer' ? 'sent' : 'received'}`}
                                  >
                                    <div className="message-content">{msg.message}</div>
                                    <div className="message-time">
                                      {new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>No messages yet</p>
                            )}

                            {/* Message Input */}
                            {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                              <div className="message-input">
                                <textarea
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  placeholder="Type your message here..."
                                  rows="2"
                                  className="form-control"
                                />
                                <button
                                  onClick={() => handleSendMessage(booking._id)}
                                  className="btn btn-primary"
                                >
                                  Send
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Review Section */}
                        {booking.review && (
                          <div className="details-section">
                            <h4>Your Review</h4>
                            <div className="review-display">
                              <div className="review-rating">
                                {'★'.repeat(booking.review.rating.overall)}
                                {'☆'.repeat(5 - booking.review.rating.overall)}
                              </div>
                              <p className="review-comment">{booking.review.comment}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-bookings">
                <h3>No bookings found</h3>
                <p>You haven't made any service bookings yet.</p>
                <Link to="/services" className="btn btn-primary">
                  Find Services
                </Link>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;