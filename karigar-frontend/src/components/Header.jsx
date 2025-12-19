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
                    <Link to="/bookings" className="nav-link">
                      My Bookings
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/profile" className="nav-link">
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