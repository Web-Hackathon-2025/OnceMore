import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './Services.css';

const Services = () => {
  const navigate = useNavigate();
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    serviceType: '',
    city: '',
    minRating: '',
    minExperience: '',
    sortBy: 'rating'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const serviceTypes = [
    { value: 'electrician', label: 'Electrician', icon: '⚡' },
    { value: 'plumber', label: 'Plumber', icon: '🔧' },
    { value: 'carpenter', label: 'Carpenter', icon: '🪚' },
    { value: 'cleaner', label: 'Cleaner', icon: '🧹' },
    { value: 'painter', label: 'Painter', icon: '🎨' },
    { value: 'other', label: 'Other', icon: '🔨' }
  ];

  useEffect(() => {
    fetchServiceProviders();
  }, [filters, pagination.page]);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: 12
      }).toString();

      const response = await api.get(`/service-providers?${params}`);
      
      if (response.success) {
        setServiceProviders(response.serviceProviders);
        setPagination({
          page: response.currentPage,
          totalPages: response.totalPages,
          total: response.total
        });
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleServiceTypeClick = (type) => {
    setFilters(prev => ({ ...prev, serviceType: type }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      serviceType: '',
      city: '',
      minRating: '',
      minExperience: '',
      sortBy: 'rating'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && serviceProviders.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section">
            <h1>Find Trusted Service Providers</h1>
            <p>Book verified professionals for all your home service needs</p>
            
            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search services or providers..."
                className="search-input"
              />
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="search-select"
              >
                <option value="">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
              </select>
              <button className="btn btn-primary">
                🔍 Search
              </button>
            </div>
          </div>

          {/* Service Categories */}
          <div className="service-categories">
            <h2>Popular Services</h2>
            <div className="categories-grid">
              {serviceTypes.map((service) => (
                <div
                  key={service.value}
                  className={`category-card ${filters.serviceType === service.value ? 'active' : ''}`}
                  onClick={() => handleServiceTypeClick(service.value)}
                >
                  <div className="category-icon">{service.icon}</div>
                  <h3>{service.label}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filters-header">
              <h2>Available Service Providers</h2>
              <div className="filter-controls">
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <button onClick={clearFilters} className="btn btn-outline">
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="filters-row">
              <select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>

              <select
                name="minExperience"
                value={filters.minExperience}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Any Experience</option>
                <option value="1">1+ Years</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>
            </div>
          </div>

          {/* Service Providers Grid */}
          {loading ? (
            <div className="loading-grid">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div className="providers-grid">
                {serviceProviders.map((provider) => (
                  <div key={provider._id} className="provider-card">
                    <div className="provider-header">
                      <div className="provider-avatar">
                        {provider.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="provider-info">
                        <h3>{provider.user?.name}</h3>
                        <div className="provider-badges">
                          <span className="badge badge-primary">
                            {provider.serviceType}
                          </span>
                          <span className="badge badge-secondary">
                            {provider.experience}+ years
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="provider-rating">
                      <div className="stars">
                        {'★'.repeat(Math.floor(provider.rating.average))}
                        {'☆'.repeat(5 - Math.floor(provider.rating.average))}
                      </div>
                      <span className="rating-text">
                        {provider.rating.average.toFixed(1)} ({provider.rating.count} reviews)
                      </span>
                    </div>

                    <div className="provider-details">
                      <p>
                        <strong>📍 Location:</strong> {provider.location?.city || 'Not specified'}
                      </p>
                      <p>
                        <strong>💰 Rate:</strong> ₹{provider.hourlyRate}/hour
                      </p>
                      <p className="provider-description">
                        {provider.description || 'No description provided'}
                      </p>
                    </div>

                    <div className="provider-actions">
                      <button
                        onClick={() => navigate(`/service-providers/${provider._id}`)}
                        className="btn btn-outline"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate(`/book-service/${provider._id}`)}
                        className="btn btn-primary"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

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

              {serviceProviders.length === 0 && (
                <div className="no-results">
                  <h3>No service providers found</h3>
                  <p>Try changing your filters or search criteria</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;