import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from '../services/authService';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: searchParams.get('role') || 'customer',
    serviceType: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const serviceTypes = [
    { value: 'electrician', label: 'Electrician' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'cleaner', label: 'Cleaner' },
    { value: 'painter', label: 'Painter' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    // Update role if URL parameter changes
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl && ['customer', 'service_provider'].includes(roleFromUrl)) {
      setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'service_provider' && !formData.serviceType) {
      setError('Please select a service type');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        serviceType: formData.role === 'service_provider' ? formData.serviceType : undefined,
      };

      const response = await AuthService.register(userData);
      
      if (response.success) {
        // Redirect to respective dashboard based on role
        if (response.user.role === 'service_provider') {
          navigate('/provider/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Karigar</div>
          <div className="auth-subtitle">Create your account</div>
        </div>

        <div className="auth-body">
          {/* Role Selection */}
          <div className="role-selection">
            <div className="role-options">
              <button
                type="button"
                className={`role-option ${formData.role === 'customer' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('customer')}
              >
                <div className="role-icon">👤</div>
                <div className="role-content">
                  <h3>Customer</h3>
                  <p>I want to book services</p>
                </div>
              </button>
              <button
                type="button"
                className={`role-option ${formData.role === 'service_provider' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('service_provider')}
              >
                <div className="role-icon">🔧</div>
                <div className="role-content">
                  <h3>Service Provider</h3>
                  <p>I want to offer services</p>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            {formData.role === 'service_provider' && (
              <div className="form-group">
                <label className="form-label">Service Type</label>
                <select
                  name="serviceType"
                  className="form-control"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required={formData.role === 'service_provider'}
                >
                  <option value="">Select your service</option>
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                  <div className="form-text">Must be at least 6 characters</div>
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span> Creating account...
                  </>
                ) : (
                  `Sign Up as ${formData.role === 'customer' ? 'Customer' : 'Service Provider'}`
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;