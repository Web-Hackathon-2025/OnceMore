import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './ServiceProviderDetail.css';

const ServiceProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [availability, setAvailability] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchServiceProvider();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate]);

  const fetchServiceProvider = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/service-providers/${id}`);
      
      if (response.success) {
        setProvider(response.serviceProvider);
      }
    } catch (error) {
      console.error('Error fetching service provider:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await api.get(`/service-providers/${id}/reviews?limit=5`);
      
      if (response.success) {
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      const response = await api.get(`/service-providers/${id}/availability?date=${selectedDate}`);
      
      if (response.success) {
        setAvailability(response);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleBookNow = () => {
    navigate(`/book-service/${id}`);
  };

  if (loading || !provider) {
    return <LoadingSpinner />;
  }

  const availableDates = getNextAvailableDates();

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/services">Services</Link> &gt; {provider.user?.name}
          </div>

          {/* Provider Header */}
          <div className="provider-header-card">
            <div className="provider-header-content">
              <div className="provider-avatar-large">
                {provider.user?.name?.charAt(0).toUpperCase()}
              </div>
              
              <div className="provider-header-info">
                <h1>{provider.user?.name}</h1>
                <div className="provider-tags">
                  <span className="tag tag-primary">{provider.serviceType}</span>
                  <span className="tag tag-secondary">Verified ✓</span>
                  <span className="tag tag-outline">{provider.experience}+ years experience</span>
                </div>
                
                <div className="provider-rating-large">
                  <div className="rating-stars">
                    {'★'.repeat(Math.floor(provider.rating.average))}
                    {'☆'.repeat(5 - Math.floor(provider.rating.average))}
                  </div>
                  <div className="rating-details">
                    <strong>{provider.rating.average.toFixed(1)}</strong>
                    <span>({provider.rating.count} reviews)</span>
                    {provider.recentBookings > 0 && (
                      <span className="booking-count">
                        • {provider.recentBookings} bookings this month
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="provider-stats">
                  <div className="stat-item">
                    <div className="stat-icon">⏱️</div>
                    <div>
                      <div className="stat-value">{provider.avgResponseTime} min</div>
                      <div className="stat-label">Avg. Response Time</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon">✅</div>
                    <div>
                      <div className="stat-value">{provider.totalJobs?.completed || 0}</div>
                      <div className="stat-label">Jobs Completed</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon">📍</div>
                    <div>
                      <div className="stat-value">{provider.location?.city || 'Online'}</div>
                      <div className="stat-label">Location</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="provider-actions-sidebar">
                <div className="pricing-card">
                  <h3>Pricing</h3>
                  <div className="price-rate">
                    <span className="price">₹{provider.hourlyRate}</span>
                    <span className="unit">/hour</span>
                  </div>
                  {provider.dailyRate > 0 && (
                    <div className="daily-rate">
                      Daily rate: ₹{provider.dailyRate}
                    </div>
                  )}
                  <div className="min-booking">
                    Minimum booking: {provider.minBookingHours} hours
                  </div>
                </div>
                
                <button onClick={handleBookNow} className="btn btn-primary btn-block">
                  Book Service
                </button>
                
                <button className="btn btn-outline btn-block">
                  Message Provider
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({provider.rating.count})
              </button>
              <button
                className={`tab ${activeTab === 'availability' ? 'active' : ''}`}
                onClick={() => setActiveTab('availability')}
              >
                Availability
              </button>
              <button
                className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
                onClick={() => setActiveTab('portfolio')}
              >
                Portfolio
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="overview-section">
                  <h2>About {provider.user?.name}</h2>
                  <p className="description">
                    {provider.description || 'No description provided.'}
                  </p>
                </div>

                <div className="overview-section">
                  <h2>Services Offered</h2>
                  <div className="skills-grid">
                    {provider.skills?.map((skill, index) => (
                      <div key={index} className="skill-tag">
                        {skill}
                      </div>
                    )) || (
                      <p>No specific skills listed.</p>
                    )}
                  </div>
                </div>

                <div className="overview-section">
                  <h2>Location</h2>
                  <div className="location-info">
                    <p>
                      <strong>City:</strong> {provider.location?.city || 'Not specified'}
                    </p>
                    <p>
                      <strong>State:</strong> {provider.location?.state || 'Not specified'}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {provider.location?.pincode || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <div className="rating-summary">
                  <div className="overall-rating">
                    <div className="rating-number">{provider.rating.average.toFixed(1)}</div>
                    <div className="rating-stars-large">
                      {'★'.repeat(Math.floor(provider.rating.average))}
                      {'☆'.repeat(5 - Math.floor(provider.rating.average))}
                    </div>
                    <div className="rating-count">{provider.rating.count} reviews</div>
                  </div>
                  
                  <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="breakdown-row">
                        <span>{star} star</span>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '80%' }}></div>
                        </div>
                        <span>80%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="reviews-list">
                  {reviewsLoading ? (
                    <div className="loading-reviews">
                      <div className="spinner"></div>
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-avatar">
                            {review.customer?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="reviewer-info">
                            <h4>{review.customer?.name}</h4>
                            <div className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="review-rating">
                            {'★'.repeat(review.rating.overall)}
                            {'☆'.repeat(5 - review.rating.overall)}
                          </div>
                        </div>
                        
                        <p className="review-comment">{review.comment}</p>
                        
                        {review.images && review.images.length > 0 && (
                          <div className="review-images">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image.url}
                                alt={image.caption}
                                className="review-image"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <h3>No reviews yet</h3>
                      <p>Be the first to review this service provider</p>
                    </div>
                  )}
                </div>
                
                {reviews.length > 0 && (
                  <Link to={`/service-providers/${id}/reviews`} className="btn btn-outline">
                    View All Reviews
                  </Link>
                )}
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="availability-content">
                <div className="availability-section">
                  <h2>Check Availability</h2>
                  
                  <div className="date-picker">
                    <label>Select Date:</label>
                    <div className="date-grid">
                      {availableDates.map((date) => (
                        <button
                          key={date}
                          className={`date-option ${selectedDate === date ? 'active' : ''}`}
                          onClick={() => setSelectedDate(date)}
                        >
                          {formatDate(date)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {availability && (
                    <div className="availability-result">
                      <h3>Available Time Slots</h3>
                      {availability.available ? (
                        availability.availableSlots.length > 0 ? (
                          <div className="time-slots">
                            {availability.availableSlots.map((slot, index) => (
                              <button key={index} className="time-slot">
                                {slot.start} - {slot.end}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="no-slots">No available slots for selected date</p>
                        )
                      ) : (
                        <p className="not-available">{availability.message}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="weekly-schedule">
                  <h2>Weekly Schedule</h2>
                  <div className="schedule-grid">
                    {Object.entries(provider.availability || {}).map(([day, schedule]) => (
                      <div key={day} className="schedule-day">
                        <div className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                        <div className={`day-status ${schedule.available ? 'available' : 'unavailable'}`}>
                          {schedule.available ? (
                            <>
                              <span className="status-indicator available"></span>
                              {schedule.start} - {schedule.end}
                            </>
                          ) : (
                            <>
                              <span className="status-indicator unavailable"></span>
                              Unavailable
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceProviderDetail;