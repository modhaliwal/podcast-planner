
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// A simplified proxy hook that provides minimal auth functionality
export function useAuthProxy() {
  const navigate = useNavigate();
  
  // Sign in function that redirects to auth page
  const signIn = async () => {
    try {
      // Redirect to auth page
      navigate('/auth');
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { error };
    }
  };
  
  // Simple sign out that removes any local tokens
  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem('auth_token');
      navigate('/auth');
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Sign Out Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  }, [navigate]);
  
  return {
    signIn,
    signOut,
    authenticateWithToken: () => true,
    isLoading: false,
    authError: null,
    isAuthenticated: true, // Always return true for now
    token: null,
    user: null,
    refreshGuests: async () => [],
    refreshEpisodes: async () => [],
    refreshAllData: async () => {},
    guests: [],
    episodes: []
  };
}

// Simpler hook for just checking authentication status
export function useIsAuthenticated() {
  return {
    isAuthenticated: true, // Always return true for now
    isLoading: false,
    authError: null,
  };
}

// Hook for checking permissions (simplified)
export function useHasPermission() {
  return {
    hasPermission: true, // Always return true for now
    isLoading: false,
    authError: null,
  };
}
