// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const ProtectedRoute = ({ element, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
