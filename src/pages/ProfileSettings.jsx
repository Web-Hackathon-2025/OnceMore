import React, { useState } from 'react'
import Navbar from '../components/Layout/Navbar'
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiEdit2, FiCamera } from 'react-icons/fi'
import './ProfileSettings.css'

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "John's Plumbing Services",
    ownerName: 'John Smith',
    email: 'john@plumbingservices.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Downtown',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    description: 'Professional plumbing services with over 15 years of experience. Licensed and insured.',
    category: 'Plumbing',
    yearsExperience: 15,
    licenseNumber: 'PL-12345',
    insuranceInfo: 'Fully insured up to $1M'
  })

  const categories = ['Plumbing', 'Cleaning', 'Electrical', 'Handyman', 'Landscaping', 'Painting']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // In production, make API call here
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  return (
    <div className="profile-settings-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div>
            <h1>Profile Settings</h1>
            <p>Manage your business profile and information</p>
          </div>
          {!isEditing ? (
            <button className="btn-primary" onClick={() => setIsEditing(true)}>
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <div className="header-actions">
              <button className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                <FiSave /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <h2>Business Information</h2>
            </div>
            
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div className="avatar">🔧</div>
                {isEditing && (
                  <button className="avatar-edit">
                    <FiCamera />
                  </button>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="businessName">
                  <FiUser /> Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ownerName">Owner Name *</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Service Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="yearsExperience">Years of Experience</label>
                <input
                  type="number"
                  id="yearsExperience"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="0"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Business Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h2>Contact Information</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="email">
                  <FiMail /> Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <FiPhone /> Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">
                  <FiMapPin /> Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h2>Credentials & Certifications</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="licenseNumber">License Number</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="insuranceInfo">Insurance Information</label>
                <input
                  type="text"
                  id="insuranceInfo"
                  name="insuranceInfo"
                  value={formData.insuranceInfo}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings

