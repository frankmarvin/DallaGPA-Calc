import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" />;
  return <>{children}</>;
}
