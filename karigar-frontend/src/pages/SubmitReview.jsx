import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './SubmitReview.css';

const SubmitReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: {
      overall: 5,
      professionalism: 5,
      quality: 5,
      punctuality: 5,
      communication: 5
    },
    comment: '',
    images: []
  });

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/${bookingId}`);
      
      if (response.success) {
        if (response.booking.review) {
          alert('Review already submitted for this booking');
          navigate('/my-bookings');
          return;
        }
        
        if (response.booking.status !== 'completed') {
          alert('Can only review completed bookings');
          navigate('/my-bookings');
          return;
        }
        
        setBooking(response.booking);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      rating: {
        ...prev.rating,
        [category]: value
      }
    }));
  };

  const handleCommentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      comment: e.target.value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload to cloud storage and get URLs
    // For now, we'll just use file names
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      caption: file.name
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    if (formData.comment.length < 10) {
      alert('Please write a more detailed review (minimum 10 characters)');
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        bookingId,
        rating: formData.rating,
        comment: formData.comment,
        images: formData.images
      };

      const response = await api.post('/reviews', reviewData);
      
      if (response.success) {
        alert('Review submitted successfully!');
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !booking) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="review-header">
            <h1>Submit Review</h1>
            <p>Share your experience with {booking.serviceProvider?.user?.name}</p>
          </div>

          <div className="review-container">
            {/* Booking Summary */}
            <div className="booking-summary-card">
              <h2>Booking Details</h2>
              
              <div className="provider-info">
                <div className="provider-avatar">
                  {booking.serviceProvider?.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="provider-details">
                  <h3>{booking.serviceProvider?.user?.name}</h3>
                  <div className="service-type">{booking.serviceType}</div>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span>Date:</span>
                  <span>{new Date(booking.schedule.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>Time:</span>
                  <span>
                    {booking.schedule.timeSlot.start} - {booking.schedule.timeSlot.end}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Service:</span>
                  <span>{booking.description}</span>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="review-form-card">
              <form onSubmit={handleSubmit}>
                {/* Overall Rating */}
                <div className="rating-section">
                  <h3>Overall Rating</h3>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= formData.rating.overall ? 'active' : ''}`}
                        onClick={() => handleRatingChange('overall', star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <div className="rating-label">
                    {formData.rating.overall === 1 && 'Poor'}
                    {formData.rating.overall === 2 && 'Fair'}
                    {formData.rating.overall === 3 && 'Good'}
                    {formData.rating.overall === 4 && 'Very Good'}
                    {formData.rating.overall === 5 && 'Excellent'}
                  </div>
                </div>

                {/* Detailed Ratings */}
                <div className="detailed-ratings">
                  <h3>Detailed Ratings</h3>
                  
                  {[
                    { key: 'professionalism', label: 'Professionalism' },
                    { key: 'quality', label: 'Quality of Work' },
                    { key: 'punctuality', label: 'Punctuality' },
                    { key: 'communication', label: 'Communication' }
                  ].map((item) => (
                    <div key={item.key} className="detailed-rating">
                      <label>{item.label}</label>
                      <div className="star-rating small">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= formData.rating[item.key] ? 'active' : ''}`}
                            onClick={() => handleRatingChange(item.key, star)}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Review Comment */}
                <div className="comment-section">
                  <h3>Your Review</h3>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={formData.comment}
                    onChange={handleCommentChange}
                    placeholder="Share details about your experience. What did you like? What could be improved?"
                    required
                  />
                  <div className="char-count">
                    {formData.comment.length} characters (minimum 10)
                  </div>
                </div>

                {/* Image Upload */}
                <div className="image-upload-section">
                  <h3>Add Photos (Optional)</h3>
                  <div className="image-upload-area">
                    <label className="upload-label">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="upload-input"
                      />
                      <div className="upload-content">
                        <div className="upload-icon">📷</div>
                        <p>Click to upload photos</p>
                        <p className="upload-hint">Maximum 5 images, 5MB each</p>
                      </div>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="uploaded-images">
                      {formData.images.map((image, index) => (
                        <div key={index} className="image-preview">
                          <img src={image.url} alt={image.caption} />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="remove-image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <Link to="/my-bookings" className="btn btn-outline">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner"></span> Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitReview;