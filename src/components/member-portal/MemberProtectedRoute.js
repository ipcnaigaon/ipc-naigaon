/**
 * Member Portal Protected Route Component
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MemberProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.memberPortal);

  if (!isAuthenticated) {
    return <Navigate to="/member-portal/login" replace />;
  }

  return children;
};

export default MemberProtectedRoute;
