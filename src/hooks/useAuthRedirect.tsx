
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function useAuthRedirect(redirectAuthenticatedTo?: string) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      // If not authenticated and we need auth, redirect to login
      if (!redirectAuthenticatedTo) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page",
          variant: "destructive"
        });
        navigate('/auth');
      }
    } else if (redirectAuthenticatedTo) {
      // If authenticated and we should redirect, do so
      navigate(redirectAuthenticatedTo);
    }
  }, [user, loading, navigate, redirectAuthenticatedTo]);

  return { 
    isAuthenticated: !!user, 
    isLoading: loading 
  };
}
