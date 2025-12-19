import React, { useState } from 'react'
import Navbar from '../components/Layout/Navbar'
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiClock } from 'react-icons/fi'
import './ManageServices.css'

const ManageServices = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    priceType: 'fixed', // fixed or hourly
    duration: '',
    category: ''
  })

  // Mock data - replace with API calls
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Pipe Repair',
      description: 'Professional pipe repair and replacement services',
      price: 75,
      priceType: 'hourly',
      duration: '1-2 hours',
      category: 'Plumbing'
    },
    {
      id: 2,
      name: 'Drain Cleaning',
      description: 'Complete drain cleaning and unclogging',
      price: 100,
      priceType: 'fixed',
      duration: '30-60 min',
      category: 'Plumbing'
    },
    {
      id: 3,
      name: 'Water Heater Installation',
      description: 'Installation of new water heater systems',
      price: 500,
      priceType: 'fixed',
      duration: '2-3 hours',
      category: 'Plumbing'
    },
    {
      id: 4,
      name: 'Leak Detection',
      description: 'Advanced leak detection and repair',
      price: 150,
      priceType: 'fixed',
      duration: '1 hour',
      category: 'Plumbing'
    }
  ])

  const categories = ['Plumbing', 'Cleaning', 'Electrical', 'Handyman', 'Landscaping', 'Painting']

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        priceType: service.priceType,
        duration: service.duration,
        category: service.category
      })
    } else {
      setEditingService(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        priceType: 'fixed',
        duration: '',
        category: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingService(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      priceType: 'fixed',
      duration: '',
      category: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingService) {
      // Update existing service
      setServices(services.map(s => 
        s.id === editingService.id 
          ? { ...editingService, ...formData, price: parseFloat(formData.price) }
          : s
      ))
    } else {
      // Add new service
      const newService = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price)
      }
      setServices([...services, newService])
    }
    
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id))
    }
  }

  return (
    <div className="manage-services-page">
      <Navbar />
      <div className="services-container">
        <div className="services-header">
          <div>
            <h1>Manage Services</h1>
            <p>Add, edit, or remove services you offer</p>
          </div>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus /> Add New Service
          </button>
        </div>

        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-header">
                <div>
                  <h3>{service.name}</h3>
                  <span className="category-badge">{service.category}</span>
                </div>
                <div className="service-actions">
                  <button 
                    className="icon-btn"
                    onClick={() => handleOpenModal(service)}
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="icon-btn danger"
                    onClick={() => handleDelete(service.id)}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <p className="service-description">{service.description}</p>
              
              <div className="service-details">
                <div className="detail-item">
                  <FiDollarSign />
                  <div>
                    <span className="detail-label">Price</span>
                    <span className="detail-value">
                      ${service.price}
                      {service.priceType === 'hourly' && '/hr'}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <FiClock />
                  <div>
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{service.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="empty-state">
            <p>No services added yet. Click "Add New Service" to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-group">
                <label htmlFor="name">Service Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="priceType">Price Type *</label>
                  <select
                    id="priceType"
                    value={formData.priceType}
                    onChange={(e) => setFormData({...formData, priceType: e.target.value})}
                    required
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Per Hour</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Estimated Duration *</label>
                <input
                  type="text"
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="e.g., 1-2 hours, 30 min"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageServices

