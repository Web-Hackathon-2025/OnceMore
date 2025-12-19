import React from 'react';
import './Layout.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Karigar</h3>
            <p>Connecting customers with trusted service providers.</p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              <li><a href="/services/electrician">Electrician</a></li>
              <li><a href="/services/plumber">Plumber</a></li>
              <li><a href="/services/carpenter">Carpenter</a></li>
              <li><a href="/services/cleaner">Cleaner</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <p>Email: support@karigar.com</p>
            <p>Phone: +91 9876543210</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Karigar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;