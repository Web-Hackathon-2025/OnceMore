import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthService from '../services/authService';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './BookService.css';

const BookService = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    schedule: {
      date: '',
      timeSlot: {
        start: '',
        end: ''
      },
      estimatedHours: 1
    },
    specialInstructions: '',
    attachments: []
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchServiceProvider();
  }, [providerId]);

  useEffect(() => {
    if (formData.schedule.date) {
      fetchAvailability();
    }
  }, [formData.schedule.date]);

  const fetchServiceProvider = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/service-providers/${providerId}`);
      
      if (response.success) {
        setProvider(response.serviceProvider);
        setFormData(prev => ({
          ...prev,
          serviceType: response.serviceProvider.serviceType
        }));
      }
    } catch (error) {
      console.error('Error fetching service provider:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await api.get(
        `/service-providers/${providerId}/availability?date=${formData.schedule.date}`
      );
      
      if (response.success && response.available) {
        setAvailableSlots(response.availableSlots);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableSlots([]);
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
      } else if (parent === 'schedule') {
        setFormData(prev => ({
          ...prev,
          schedule: {
            ...prev.schedule,
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
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        timeSlot: {
          start: slot.start,
          end: slot.end
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.description.trim()) {
      alert('Please provide a service description');
      return;
    }
    
    if (!formData.address.street.trim() || !formData.address.city.trim()) {
      alert('Please provide your address');
      return;
    }
    
    if (!formData.schedule.date || !selectedSlot) {
      alert('Please select date and time slot');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        serviceProviderId: providerId,
        ...formData
      };

      const response = await api.post('/bookings', bookingData);
      
      if (response.success) {
        alert('Booking request sent successfully!');
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const calculateEstimatedCost = () => {
    const hours = formData.schedule.estimatedHours || 1;
    return provider ? provider.hourlyRate * hours : 0;
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
          <div className="booking-header">
            <h1>Book Service</h1>
            <p>Complete the form below to request service from {provider.user?.name}</p>
          </div>

          <div className="booking-container">
            {/* Left Column - Form */}
            <div className="booking-form-section">
              <form onSubmit={handleSubmit}>
                {/* Service Details */}
                <div className="form-section">
                  <h2>Service Details</h2>
                  
                  <div className="form-group">
                    <label className="form-label">Service Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.serviceType}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Description *</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the service you need in detail..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Hours</label>
                    <select
                      name="schedule.estimatedHours"
                      className="form-control"
                      value={formData.schedule.estimatedHours}
                      onChange={handleInputChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(hours => (
                        <option key={hours} value={hours}>
                          {hours} hour{hours > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address Details */}
                <div className="form-section">
                  <h2>Service Address</h2>
                  
                  <div className="form-group">
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      name="address.street"
                      className="form-control"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      placeholder="House no, building, street"
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          name="address.city"
                          className="form-control"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="col">
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          name="address.state"
                          className="form-control"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          placeholder="State"
                        />
                      </div>
                    </div>
                    
                    <div className="col">
                      <div className="form-group">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          name="address.pincode"
                          className="form-control"
                          value={formData.address.pincode}
                          onChange={handleInputChange}
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="form-section">
                  <h2>Schedule Service</h2>
                  
                  <div className="form-group">
                    <label className="form-label">Select Date *</label>
                    <select
                      name="schedule.date"
                      className="form-control"
                      value={formData.schedule.date}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose a date</option>
                      {availableDates.map(date => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.schedule.date && availableSlots.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">Available Time Slots *</label>
                      <div className="time-slots-grid">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`time-slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                            onClick={() => handleSlotSelect(slot)}
                          >
                            {slot.start} - {slot.end}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.schedule.date && availableSlots.length === 0 && (
                    <div className="alert alert-warning">
                      No available slots for selected date. Please choose another date.
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                <div className="form-section">
                  <h2>Additional Information</h2>
                  
                  <div className="form-group">
                    <label className="form-label">Special Instructions</label>
                    <textarea
                      name="specialInstructions"
                      className="form-control"
                      rows="3"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or instructions..."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
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
                      'Submit Booking Request'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Summary */}
            <div className="booking-summary-section">
              <div className="summary-card">
                <h2>Booking Summary</h2>
                
                <div className="provider-summary">
                  <div className="provider-avatar-small">
                    {provider.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="provider-details">
                    <h3>{provider.user?.name}</h3>
                    <div className="provider-rating">
                      {'★'.repeat(Math.floor(provider.rating.average))}
                      {'☆'.repeat(5 - Math.floor(provider.rating.average))}
                      <span> ({provider.rating.count})</span>
                    </div>
                  </div>
                </div>

                <div className="summary-details">
                  <div className="summary-row">
                    <span>Service Type:</span>
                    <strong>{formData.serviceType}</strong>
                  </div>
                  
                  <div className="summary-row">
                    <span>Hourly Rate:</span>
                    <strong>₹{provider.hourlyRate}/hour</strong>
                  </div>
                  
                  <div className="summary-row">
                    <span>Estimated Hours:</span>
                    <strong>{formData.schedule.estimatedHours} hours</strong>
                  </div>
                  
                  {formData.schedule.date && (
                    <div className="summary-row">
                      <span>Selected Date:</span>
                      <strong>
                        {new Date(formData.schedule.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </strong>
                    </div>
                  )}
                  
                  {selectedSlot && (
                    <div className="summary-row">
                      <span>Time Slot:</span>
                      <strong>{selectedSlot.start} - {selectedSlot.end}</strong>
                    </div>
                  )}
                </div>

                <div className="price-summary">
                  <div className="price-row">
                    <span>Estimated Cost:</span>
                    <span className="price">₹{calculateEstimatedCost()}</span>
                  </div>
                  
                  <div className="price-note">
                    * This is an estimate. Final price may vary based on actual work.
                  </div>
                </div>

                <div className="terms-section">
                  <h3>Terms & Conditions</h3>
                  <ul className="terms-list">
                    <li>Payment is due upon completion of service</li>
                    <li>Cancellation within 24 hours may incur charges</li>
                    <li>Provider will contact you to confirm booking</li>
                    <li>Price may vary based on actual work required</li>
                  </ul>
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

export default BookService;