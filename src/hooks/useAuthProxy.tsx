
import { useFederatedAuth } from '@/contexts/FederatedAuthContext';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { federatedSignIn } from '@/integrations/auth/federated-auth';
import { useGuestsData } from '@/hooks/guests/useGuestsData';
import { useEpisodesData } from '@/hooks/episodes/useEpisodesData';

// A proxy hook that combines the federated auth with fallback functionality
export function useAuthProxy() {
  const { authModule, authError, isLoading: contextLoading, authToken, setAuthToken } = useFederatedAuth();
  const { useAuth } = authModule;
  const federatedAuth = useAuth();
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  
  // Get the user ID (either from federated auth or token)
  const userId = federatedAuth?.user?.id || (authToken ? 'current-user' : undefined);
  
  // Use the guest and episode data hooks for compatibility with old code
  const { guests, refreshGuests } = useGuestsData(userId);
  const { episodes, refreshEpisodes } = useEpisodesData(userId);
  
  // Determine overall loading state
  const isLoading = contextLoading || federatedAuth.isLoading || !initialized;
  
  // Handle auth module errors
  useEffect(() => {
    if (!contextLoading && authError) {
      console.warn(`Auth module error: ${authError}`);
    }
    setInitialized(true);
  }, [authError, contextLoading]);
  
  // Add refreshAllData for backward compatibility
  const refreshAllData = useCallback(async () => {
    console.log("Refreshing all data");
    try {
      const guestsPromise = refreshGuests(true);
      const episodesPromise = refreshEpisodes(true);
      await Promise.all([guestsPromise, episodesPromise]);
      console.log("All data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing all data:", error);
    }
  }, [refreshGuests, refreshEpisodes]);
  
  // Enhanced sign in with token storage
  const signIn = async (email: string, password: string) => {
    try {
      if (authError) {
        toast({
          title: 'Authentication Service Unavailable',
          description: 'Please try again later.',
          variant: 'destructive',
        });
        return { error: { message: 'Authentication service unavailable' } };
      }
      
      // Use the federated sign-in function
      const result = await federatedSignIn(email, password);
      
      if (result.error) {
        toast({
          title: 'Authentication Failed',
          description: result.error.message,
          variant: 'destructive',
        });
        return result;
      }
      
      // Store the token if available
      if (result.data?.session) {
        const token = {
          access_token: result.data.session.access_token,
          refresh_token: result.data.session.refresh_token,
          expires_at: Date.now() + (result.data.session.expires_in || 3600) * 1000
        };
        
        setAuthToken(token);
        
        toast({
          title: 'Authentication Successful',
          description: 'You have been signed in.',
        });
        
        // Initialize data after successful sign-in
        setTimeout(() => refreshAllData(), 0);
        
        navigate('/dashboard');
      }
      
      return result;
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { error };
    }
  };
  
  // Enhanced sign out with token cleanup
  const signOut = async () => {
    try {
      // Clear local token storage
      setAuthToken(null);
      
      // Call the federated sign out if available
      await federatedAuth.signOut();
      
      navigate('/auth');
      toast({
        title: 'Signed Out',
        description: 'You have been signed out successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign Out Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  return {
    ...federatedAuth,
    signIn,
    signOut,
    isLoading,
    authError,
    isAuthenticated: !!authToken,
    token: authToken?.access_token,
    // Add backward compatibility methods
    refreshGuests,
    refreshEpisodes,
    refreshAllData,
    guests,
    episodes
  };
}

// Proxy hook for checking authentication status
export function useIsAuthenticatedProxy() {
  const { authModule, authError, isLoading: contextLoading, authToken } = useFederatedAuth();
  const { useIsAuthenticated } = authModule;
  const { isAuthenticated: federatedIsAuthenticated, isLoading: authLoading } = useIsAuthenticated();
  
  // Either we're authenticated by token or by the federated auth
  const isAuthenticated = !!authToken || federatedIsAuthenticated;
  
  return {
    isAuthenticated,
    isLoading: contextLoading || authLoading,
    authError,
  };
}

// Proxy hook for checking permissions
export function useHasPermissionProxy(permission: string) {
  const { authModule, authError, isLoading: contextLoading, authToken } = useFederatedAuth();
  const { useHasPermission } = authModule;
  const { hasPermission, isLoading: permissionLoading } = useHasPermission(permission);
  
  // If we don't have a token, we don't have any permissions
  if (!authToken && !contextLoading) {
    return {
      hasPermission: false,
      isLoading: false,
      authError,
    };
  }
  
  return {
    hasPermission,
    isLoading: contextLoading || permissionLoading,
    authError,
  };
}
