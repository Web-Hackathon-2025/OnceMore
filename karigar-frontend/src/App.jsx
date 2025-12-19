import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './components/Layout.css';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx'; // Add this
import CustomerProfile from './pages/CustomerProfile.jsx'; // Add this
import Services from './pages/Services.jsx';
import ServiceProviderDetail from './pages/ServiceProviderDetail.jsx';
import BookService from './pages/BookService.jsx';
import MyBookings from './pages/MyBookings.jsx';
import SubmitReview from './pages/SubmitReview.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute allowedRoles={['customer']}>
              <CustomerProfile />
            </PrivateRoute>
          } />
          
          {/* Old profile route (keep for service providers) */}
          <Route path="/my-profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          <Route path="/services" element={
            <PrivateRoute allowedRoles={['customer']}>
              <Services />
            </PrivateRoute>
          } />
          
          <Route path="/service-providers/:id" element={
            <PrivateRoute allowedRoles={['customer']}>
              <ServiceProviderDetail />
            </PrivateRoute>
          } />
          
          <Route path="/book-service/:providerId" element={
            <PrivateRoute allowedRoles={['customer']}>
              <BookService />
            </PrivateRoute>
          } />
          
          <Route path="/my-bookings" element={
            <PrivateRoute allowedRoles={['customer']}>
              <MyBookings />
            </PrivateRoute>
          } />
          
          <Route path="/submit-review/:bookingId" element={
            <PrivateRoute allowedRoles={['customer']}>
              <SubmitReview />
            </PrivateRoute>
          } />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;