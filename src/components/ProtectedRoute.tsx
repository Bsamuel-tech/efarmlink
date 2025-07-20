import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'farmer' | 'buyer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />;
  }

  if (userType && user?.type !== userType) {
    return <Navigate to={user?.type === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;