import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const handleGetStarted = () => {
    if (user) {
      // Redirect to respective dashboard based on role
      if (user.role === 'service_provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="home-nav">
        <div className="container">
          <div className="nav-content">
            <div className="nav-brand">
              <span className="logo-icon">🔧</span>
              <span className="logo-text">Karigar</span>
            </div>
            <div className="nav-links">
              {user ? (
                <button onClick={handleGetStarted} className="btn btn-primary">
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <button onClick={handleGetStarted} className="btn btn-primary">
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Trusted <span className="highlight">Service Providers</span> or 
              <span className="highlight"> Grow Your Business</span>
            </h1>
            <p className="hero-subtitle">
              Karigar connects customers with verified service providers for all home services.
              Whether you need a service or want to offer one, we've got you covered.
            </p>
            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                Get Started Free
              </button>
              <Link to="#how-it-works" className="btn btn-outline btn-lg">
                How It Works
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Service Providers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Cities</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8★</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              {/* You can add an actual image here */}
              <div className="floating-card customer">
                <div className="card-icon">👤</div>
                <h3>Find Services</h3>
                <p>Book verified professionals</p>
              </div>
              <div className="floating-card provider">
                <div className="card-icon">🔧</div>
                <h3>Offer Services</h3>
                <p>Grow your business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2 className="section-title">How Karigar Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">📱</div>
              <h3>Sign Up</h3>
              <p>Register as a customer or service provider</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">🔍</div>
              <h3>Find or Offer</h3>
              <p>Browse services or list your expertise</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">🤝</div>
              <h3>Connect</h3>
              <p>Book services or get bookings</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-icon">⭐</div>
              <h3>Rate & Review</h3>
              <p>Share your experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Customers */}
      <section className="for-customers">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">For Customers</h2>
            <p className="section-subtitle">Get quality services from verified professionals</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Verified Providers</h3>
              <p>All service providers are thoroughly verified for quality and reliability</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Transparent Pricing</h3>
              <p>Clear pricing with no hidden charges. Pay only for work done</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Service Guarantee</h3>
              <p>Quality guaranteed or your money back</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Booking</h3>
              <p>Book services in minutes with our simple platform</p>
            </div>
          </div>
          <div className="section-actions">
            <Link to="/register?role=customer" className="btn btn-primary btn-lg">
              Sign Up as Customer
            </Link>
          </div>
        </div>
      </section>

      {/* For Service Providers */}
      <section className="for-providers">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">For Service Providers</h2>
            <p className="section-subtitle">Grow your business with Karigar</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>More Customers</h3>
              <p>Access thousands of potential customers in your area</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Get paid on time with our secure payment system</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Business Growth</h3>
              <p>Build your reputation with reviews and ratings</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3>Easy Management</h3>
              <p>Manage bookings, schedules, and payments in one place</p>
            </div>
          </div>
          <div className="section-actions">
            <Link to="/register?role=service_provider" className="btn btn-secondary btn-lg">
              Sign Up as Service Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="popular-services">
        <div className="container">
          <h2 className="section-title">Popular Services</h2>
          <div className="services-grid">
            {[
              { icon: '⚡', name: 'Electrician', desc: 'Electrical repairs & installations' },
              { icon: '🔧', name: 'Plumber', desc: 'Pipe repairs & installations' },
              { icon: '🪚', name: 'Carpenter', desc: 'Furniture & woodwork' },
              { icon: '🧹', name: 'Cleaner', desc: 'Home & office cleaning' },
              { icon: '🎨', name: 'Painter', desc: 'Wall painting & decoration' },
              { icon: '🔨', name: 'AC Repair', desc: 'AC servicing & repairs' },
              { icon: '💻', name: 'Computer Repair', desc: 'PC & laptop repairs' },
              { icon: '📱', name: 'Appliance Repair', desc: 'Home appliance repairs' },
            ].map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers and service providers</p>
            <div className="cta-buttons">
              <Link to="/register?role=customer" className="btn btn-primary btn-lg">
                Join as Customer
              </Link>
              <Link to="/register?role=service_provider" className="btn btn-secondary btn-lg">
                Join as Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <span className="logo-icon">🔧</span>
                <span className="logo-text">Karigar</span>
              </div>
              <p>Connecting customers with trusted service providers</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="#how-it-works">How It Works</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Services</h3>
              <ul>
                <li><a href="#">Electrician</a></li>
                <li><a href="#">Plumber</a></li>
                <li><a href="#">Carpenter</a></li>
                <li><a href="#">Cleaner</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: support@karigar.com</p>
              <p>Phone: +91 9876543210</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Karigar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;