
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function useAuthRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isIndexPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (loading) return;
    
    // If on the auth page and already authenticated, redirect to dashboard
    if (isAuthPage && user) {
      const destination = location.state?.from || '/dashboard';
      navigate(destination, { replace: true });
      return;
    }
    
    // If not on index or auth page and not authenticated, redirect to auth
    if (!isIndexPage && !isAuthPage && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue",
        variant: "destructive"
      });
      navigate('/auth', { state: { from: location.pathname }, replace: true });
    }
  }, [user, loading, navigate, location, isIndexPage, isAuthPage]);

  return { 
    isAuthenticated: !!user, 
    isLoading: loading 
  };
}
