import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import './Layout.css';

const Header = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="d-flex justify-between align-center">
          <Link to="/" className="navbar-brand">
            <span className="karigar-logo">🔧</span>
            Karigar
          </Link>

          <ul className="navbar-nav">
            {user ? (
              <>
<<<<<<< HEAD
                <li>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                {user.role === 'customer' && (
                  <li>
                    <Link to="/services" className="nav-link">
                      Find Services
                    </Link>
                  </li>
                )}
                {user.role === 'service_provider' && (
                  <li>
                    <Link to="/provider-dashboard" className="nav-link">
                      Provider Dashboard
                    </Link>
                  </li>
=======
                {user.role === 'customer' ? (
                  <>
                    <li>
                      <Link to="/dashboard" className="nav-link">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/services" className="nav-link">
                        Find Services
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-bookings" className="nav-link">
                        My Bookings
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/provider/dashboard" className="nav-link">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/provider/bookings" className="nav-link">
                        Bookings
                      </Link>
                    </li>
                    <li>
                      <Link to="/provider/earnings" className="nav-link">
                        Earnings
                      </Link>
                    </li>
                  </>
>>>>>>> 23afb30c2d787357d677d9cc1d8ed923536aef68
                )}
                
                <li>
                  <Link to={user.role === 'customer' ? '/profile' : '/provider/profile'} className="nav-link">
                    Profile
                  </Link>
                </li>
                
                <li>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;