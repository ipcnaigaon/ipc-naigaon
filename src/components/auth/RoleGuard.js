/**
 * Role Guard Component
 * Protects routes based on user roles
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleGuard = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Trim and normalize the user role for comparison
  const userRole = (user?.role || '').trim();

  if (!allowedRoles.includes(userRole)) {
    return (
      <div style={{
        padding: '60px',
        textAlign: 'center',
        color: '#e53e3e'
      }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
