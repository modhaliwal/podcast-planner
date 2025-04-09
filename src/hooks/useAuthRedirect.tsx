
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useFederatedAuth } from '@/contexts/FederatedAuthContext';

export function useAuthRedirect() {
  const { isAuthenticated, authToken } = useFederatedAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isIndexPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Avoid multiple redirects for the same condition
    if (hasRedirectedRef.current) return;
    
    // If on the auth page and already authenticated, redirect to dashboard
    if (isAuthPage && isAuthenticated) {
      // Skip redirection if this is a callback (has token in query params)
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get("token")) return;
      
      const destination = location.state?.from || '/dashboard';
      hasRedirectedRef.current = true;
      navigate(destination, { replace: true });
      return;
    }
    
    // If not on index or auth page and not authenticated, redirect to auth
    if (!isIndexPage && !isAuthPage && !isAuthenticated) {
      hasRedirectedRef.current = true;
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue",
        variant: "destructive"
      });
      navigate('/auth', { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, authToken, navigate, location, isIndexPage, isAuthPage]);

  return { 
    isAuthenticated
  };
}
