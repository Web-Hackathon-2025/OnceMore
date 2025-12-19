import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AuthService from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        const response = await AuthService.getProfile();
        if (response.success) {
          setUser(response.user);
          setFormData({
            name: response.user.name || '',
            email: response.user.email || '',
            phone: response.user.phone || '',
            serviceType: response.user.serviceType || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const response = await AuthService.updateProfile(formData);
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setUser(response.user);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error updating profile' });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="card-title mb-4">Edit Profile</h1>

            {message.text && (
              <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled
                />
                <small className="form-text">Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit phone number"
                />
              </div>

              {user?.role === 'service_provider' && (
                <div className="form-group">
                  <label className="form-label">Service Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    placeholder="e.g., Plumber, Electrician"
                  />
                </div>
              )}

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;

