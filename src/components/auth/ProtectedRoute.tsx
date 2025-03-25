
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { toast } from 'sonner';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingIndicator fullPage />;
  }

  // Check for dev user in localStorage if no actual user and we're in development
  const hasDevUser = isDevelopment && 
    localStorage.getItem('supabase.auth.token') && 
    JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.currentSession?.user;

  if (!user && !hasDevUser) {
    // If user is not logged in, redirect to login page
    // and pass the location they were trying to access
    toast.error("Authentication required. Please sign in to continue.");
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
