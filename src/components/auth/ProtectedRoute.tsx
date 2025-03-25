
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingIndicator fullPage />;
  }

  if (!user) {
    // If user is not logged in, redirect to login page
    // and pass the location they were trying to access
    toast.error("Authentication required. Please sign in to continue.");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
