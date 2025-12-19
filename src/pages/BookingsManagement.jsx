import React, { useState } from 'react'
import Navbar from '../components/Layout/Navbar'
import { 
  FiCalendar, FiClock, FiMapPin, FiUser, FiCheckCircle, 
  FiXCircle, FiLoader, FiMessageCircle, FiEye, FiDollarSign, FiStar
} from 'react-icons/fi'
import './BookingsManagement.css'

const BookingsManagement = () => {
  const [filter, setFilter] = useState('all')

  // Mock data - replace with API calls
  const bookings = [
    {
      id: 1,
      customerName: 'Sarah M.',
      customerPhone: '+1 (555) 123-4567',
      service: 'Pipe Repair',
      status: 'confirmed',
      date: '2024-01-15',
      time: '10:00 AM',
      address: '123 Main St, Downtown',
      amount: 150,
      description: 'Kitchen sink pipe is leaking',
      createdAt: '2024-01-14',
      estimatedDuration: '1-2 hours'
    },
    {
      id: 2,
      customerName: 'Mike T.',
      customerPhone: '+1 (555) 234-5678',
      service: 'Drain Cleaning',
      status: 'pending',
      date: '2024-01-16',
      time: '2:00 PM',
      address: '456 Oak Ave, North Side',
      amount: 100,
      description: 'Bathroom drain is clogged',
      createdAt: '2024-01-15',
      estimatedDuration: '30-60 min'
    },
    {
      id: 3,
      customerName: 'Lisa K.',
      customerPhone: '+1 (555) 345-6789',
      service: 'Water Heater Installation',
      status: 'pending',
      date: '2024-01-17',
      time: '9:00 AM',
      address: '789 Tech Blvd, South Side',
      amount: 500,
      description: 'Need new water heater installed',
      createdAt: '2024-01-15',
      estimatedDuration: '2-3 hours'
    },
    {
      id: 4,
      customerName: 'John D.',
      customerPhone: '+1 (555) 456-7890',
      service: 'Leak Detection',
      status: 'in-progress',
      date: '2024-01-15',
      time: '2:00 PM',
      address: '321 Garden St, Suburbs',
      amount: 150,
      description: 'Water leak in basement',
      createdAt: '2024-01-14',
      estimatedDuration: '1 hour'
    },
    {
      id: 5,
      customerName: 'Emma W.',
      customerPhone: '+1 (555) 567-8901',
      service: 'Fixture Installation',
      status: 'completed',
      date: '2024-01-10',
      time: '11:00 AM',
      address: '654 Paint Rd, East Side',
      amount: 85,
      description: 'Install new bathroom faucet',
      createdAt: '2024-01-09',
      completedAt: '2024-01-10',
      rating: 5
    }
  ]

  const statusFilters = [
    { value: 'all', label: 'All Bookings', count: bookings.length },
    { value: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { value: 'in-progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in-progress').length },
    { value: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length }
  ]

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter)

  const handleStatusChange = (bookingId, newStatus) => {
    // In production, make API call here
    alert(`Booking status updated to ${newStatus}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiLoader className="status-icon pending" />
      case 'confirmed':
        return <FiCheckCircle className="status-icon confirmed" />
      case 'in-progress':
        return <FiLoader className="status-icon in-progress" />
      case 'completed':
        return <FiCheckCircle className="status-icon completed" />
      default:
        return null
    }
  }

  return (
    <div className="bookings-management-page">
      <Navbar />
      <div className="bookings-container">
        <div className="bookings-header">
          <div>
            <h1>Bookings Management</h1>
            <p>View and manage all service requests</p>
          </div>
        </div>

        <div className="status-filters">
          {statusFilters.map(filterOption => (
            <button
              key={filterOption.value}
              className={`filter-btn ${filter === filterOption.value ? 'active' : ''}`}
              onClick={() => setFilter(filterOption.value)}
            >
              {filterOption.label}
              <span className="filter-count">{filterOption.count}</span>
            </button>
          ))}
        </div>

        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found for this status.</p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-main-info">
                    <div className="booking-status-badge">
                      {getStatusIcon(booking.status)}
                      <span className={`status-${booking.status}`}>
                        {booking.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="booking-title">
                      <h3>{booking.service}</h3>
                      <p>{booking.customerName}</p>
                    </div>
                  </div>
                  <div className="booking-amount">${booking.amount}</div>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <FiCalendar />
                    <div>
                      <span className="detail-label">Scheduled Date</span>
                      <span className="detail-value">{formatDate(booking.date)}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiClock />
                    <div>
                      <span className="detail-label">Time</span>
                      <span className="detail-value">{booking.time}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiMapPin />
                    <div>
                      <span className="detail-label">Address</span>
                      <span className="detail-value">{booking.address}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiUser />
                    <div>
                      <span className="detail-label">Customer</span>
                      <span className="detail-value">{booking.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-description">
                  <p><strong>Description:</strong> {booking.description}</p>
                </div>

                {booking.status === 'completed' && booking.rating && (
                  <div className="booking-rating">
                    <span>Customer Rating: </span>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`star ${i < booking.rating ? 'filled' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button 
                        className="action-btn success"
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      >
                        <FiCheckCircle /> Accept
                      </button>
                      <button 
                        className="action-btn danger"
                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                      >
                        <FiXCircle /> Decline
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button 
                      className="action-btn primary"
                      onClick={() => handleStatusChange(booking.id, 'in-progress')}
                    >
                      <FiLoader /> Start Service
                    </button>
                  )}
                  {booking.status === 'in-progress' && (
                    <button 
                      className="action-btn success"
                      onClick={() => handleStatusChange(booking.id, 'completed')}
                    >
                      <FiCheckCircle /> Complete
                    </button>
                  )}
                  <button className="action-btn secondary">
                    <FiMessageCircle /> Message
                  </button>
                  <button className="action-btn secondary">
                    <FiEye /> View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingsManagement

