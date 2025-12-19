import React, { useState } from 'react'
import Navbar from '../components/Layout/Navbar'
import { FiClock, FiCalendar, FiSave } from 'react-icons/fi'
import './Availability.css'

const Availability = () => {
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '17:00' }
  })

  const [timeSlots, setTimeSlots] = useState([
    { id: 1, day: '2024-01-15', start: '10:00', end: '12:00', status: 'booked' },
    { id: 2, day: '2024-01-15', start: '14:00', end: '16:00', status: 'available' },
    { id: 3, day: '2024-01-16', start: '09:00', end: '11:00', status: 'booked' },
    { id: 4, day: '2024-01-17', start: '13:00', end: '15:00', status: 'available' }
  ])

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  const handleDayChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: field === 'enabled' ? value : value
      }
    }))
  }

  const handleSave = () => {
    // In production, make API call here
    alert('Availability settings saved successfully!')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="availability-page">
      <Navbar />
      <div className="availability-container">
        <div className="availability-header">
          <div>
            <h1>Manage Availability</h1>
            <p>Set your working hours and schedule</p>
          </div>
          <button className="btn-primary" onClick={handleSave}>
            <FiSave /> Save Changes
          </button>
        </div>

        <div className="availability-content">
          <div className="availability-section">
            <h2>Weekly Schedule</h2>
            <p className="section-description">Set your default working hours for each day of the week</p>
            
            <div className="schedule-list">
              {days.map(day => (
                <div key={day.key} className="schedule-item">
                  <div className="day-info">
                    <input
                      type="checkbox"
                      id={day.key}
                      checked={availability[day.key].enabled}
                      onChange={(e) => handleDayChange(day.key, 'enabled', e.target.checked)}
                      className="day-checkbox"
                    />
                    <label htmlFor={day.key} className="day-label">
                      {day.label}
                    </label>
                  </div>
                  
                  {availability[day.key].enabled && (
                    <div className="time-inputs">
                      <div className="time-input-group">
                        <label>Start</label>
                        <input
                          type="time"
                          value={availability[day.key].start}
                          onChange={(e) => handleDayChange(day.key, 'start', e.target.value)}
                          className="time-input"
                        />
                      </div>
                      <span className="time-separator">to</span>
                      <div className="time-input-group">
                        <label>End</label>
                        <input
                          type="time"
                          value={availability[day.key].end}
                          onChange={(e) => handleDayChange(day.key, 'end', e.target.value)}
                          className="time-input"
                        />
                      </div>
                    </div>
                  )}
                  
                  {!availability[day.key].enabled && (
                    <span className="unavailable-badge">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="availability-section">
            <h2>Upcoming Schedule</h2>
            <p className="section-description">View and manage your upcoming appointments</p>
            
            <div className="time-slots-list">
              {timeSlots.map(slot => (
                <div key={slot.id} className={`time-slot-card ${slot.status}`}>
                  <div className="slot-date">
                    <FiCalendar />
                    <div>
                      <strong>{formatDate(slot.day)}</strong>
                      <span>{slot.start} - {slot.end}</span>
                    </div>
                  </div>
                  <div className="slot-status">
                    <span className={`status-badge ${slot.status}`}>
                      {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {timeSlots.length === 0 && (
              <div className="empty-state">
                <p>No upcoming appointments scheduled.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Availability

