
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useAuthRedirect(redirectAuthenticatedTo?: string) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
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

  return { isAuthenticated: !!user, isLoading: loading };
}
