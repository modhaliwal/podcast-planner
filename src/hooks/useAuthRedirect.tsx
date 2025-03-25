
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

export function useAuthRedirect(redirectAuthenticatedTo?: string) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // Check for development mode user in localStorage if no actual user
    const hasDevUser = isDevelopment && 
      localStorage.getItem('supabase.auth.token') && 
      JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.currentSession?.user;
    
    if (!user && !hasDevUser) {
      // If not authenticated and we need auth, redirect to login
      if (!redirectAuthenticatedTo) {
        toast.error("Please sign in to access this page");
        navigate('/auth');
      }
    } else if (redirectAuthenticatedTo) {
      // If authenticated and we should redirect, do so
      navigate(redirectAuthenticatedTo);
    }
  }, [user, loading, navigate, redirectAuthenticatedTo]);

  // Check for dev user in development mode
  const hasDevUser = isDevelopment && 
    localStorage.getItem('supabase.auth.token') && 
    JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.currentSession?.user;
  
  return { 
    isAuthenticated: !!user || !!hasDevUser, 
    isLoading: loading 
  };
}
