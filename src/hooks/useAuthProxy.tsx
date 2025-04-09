
import { useFederatedAuth } from '@/contexts/FederatedAuthContext';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// A proxy hook that provides auth functionality based on federation
export function useAuthProxy() {
  const { 
    authModule, 
    authError, 
    isLoading: contextLoading, 
    authToken, 
    setAuthToken,
    isAuthenticated,
    logout: contextLogout,
  } = useFederatedAuth();
  
  const navigate = useNavigate();
  
  // Enhanced sign in with token storage
  const signIn = async () => {
    try {
      if (authError) {
        toast({
          title: 'Authentication Service Unavailable',
          description: 'Please try again later.',
          variant: 'destructive',
        });
        return { error: { message: 'Authentication service unavailable' } };
      }
      
      // Use the federated sign-in function with full callbackUrl
      // Now we're using the main /auth route for the callback
      const callbackUrl = `${window.location.origin}/auth?redirectTo=/dashboard`;
      
      // Check if authModule has federatedSignIn method
      if (authModule && typeof authModule.federatedSignIn === 'function') {
        return authModule.federatedSignIn(callbackUrl);
      } else {
        // Use local implementation as fallback
        window.location.href = `${callbackUrl}`;
        return { success: true };
      }
      
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { error };
    }
  };
  
  // For direct authentication with token (e.g., from external provider)
  const authenticateWithToken = useCallback((token: string, refreshToken: string, expiresIn: number = 3600) => {
    const authToken = {
      access_token: token,
      refresh_token: refreshToken,
      expires_at: Date.now() + (expiresIn * 1000)
    };
    
    setAuthToken(authToken);
    return true;
  }, [setAuthToken]);
  
  // Enhanced sign out that uses the context logout
  const signOut = useCallback(async () => {
    try {
      contextLogout();
      
      // Call the federated sign out if available
      if (authModule && typeof authModule.signOut === 'function') {
        await authModule.signOut();
      }
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Sign Out Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  }, [contextLogout, authModule]);
  
  return {
    signIn,
    signOut,
    authenticateWithToken,
    isLoading: contextLoading,
    authError,
    isAuthenticated,
    token: authToken?.access_token,
    // Provide empty implementations for backward compatibility
    refreshGuests: async () => [],
    refreshEpisodes: async () => [],
    refreshAllData: async () => {},
    guests: [],
    episodes: []
  };
}

// Simpler hook for just checking authentication status
export function useIsAuthenticated() {
  const { isAuthenticated, isLoading, authError } = useFederatedAuth();
  
  return {
    isAuthenticated,
    isLoading,
    authError,
  };
}

// Hook for checking permissions (simplified)
export function useHasPermission(permission: string) {
  const { authToken, isLoading, authError } = useFederatedAuth();
  
  // Simple permission check - in a real implementation,
  // you would decode the JWT and check the permissions claim
  const hasPermission = !!authToken;
  
  return {
    hasPermission,
    isLoading,
    authError,
  };
}
