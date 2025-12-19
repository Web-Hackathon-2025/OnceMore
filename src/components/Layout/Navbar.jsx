import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/") return true;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Provider Portal</h2>
        </div>
        <div className="navbar-links">
          <Link
            to="/provider/dashboard"
            className={`nav-link ${
              isActive("/provider/dashboard") || isActive("/provider") ? "active" : ""
            }`}
          >
            <FiHome className="nav-icon" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/provider/services"
            className={`nav-link ${isActive("/provider/services") ? "active" : ""}`}
          >
            <FiBriefcase className="nav-icon" />
            <span>Services</span>
          </Link>
          <Link
            to="/provider/bookings"
            className={`nav-link ${isActive("/provider/bookings") ? "active" : ""}`}
          >
            <FiCalendar className="nav-icon" />
            <span>Bookings</span>
          </Link>
          <Link
            to="/provider/availability"
            className={`nav-link ${isActive("/provider/availability") ? "active" : ""}`}
          >
            <FiClock className="nav-icon" />
            <span>Availability</span>
          </Link>
          <Link
            to="/provider/earnings"
            className={`nav-link ${isActive("/provider/earnings") ? "active" : ""}`}
          >
            <FiDollarSign className="nav-icon" />
            <span>Earnings</span>
          </Link>
          <Link
            to="/provider/profile"
            className={`nav-link ${isActive("/provider/profile") ? "active" : ""}`}
          >
            <FiUser className="nav-icon" />
            <span>Profile</span>
          </Link>
          <div className="nav-link logout">
            <FiLogOut className="nav-icon" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
