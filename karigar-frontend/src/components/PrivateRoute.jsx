import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = AuthService.getCurrentUser();
  
  // Check if user is authenticated
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;