
import { useFederatedAuth } from '@/contexts/FederatedAuthContext';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { federatedSignIn, federatedSignOut, signInAsDevUser } from '@/integrations/auth/federated-auth';

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
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Enhanced sign in with token storage
  const signIn = async () => {
    try {
      setIsLoading(true);
      
      if (authError) {
        toast({
          title: 'Authentication Service Unavailable',
          description: 'Please try again later.',
          variant: 'destructive',
        });
        return { error: { message: 'Authentication service unavailable' } };
      }
      
      // Use the federated sign-in function with full callbackUrl
      const callbackUrl = `${window.location.origin}/auth/callback?redirectTo=/dashboard`;
      federatedSignIn(callbackUrl);
      
      // This will redirect, so we don't have to return anything meaningful
      return { success: true };
      
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { error };
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      contextLogout();
      federatedSignOut();
      return true;
    } catch (error: any) {
      toast({
        title: 'Sign Out Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contextLogout]);
  
  // Sign in as dev user
  const signInAsDev = useCallback(() => {
    try {
      const token = signInAsDevUser();
      setAuthToken(token);
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Dev Auth Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { error };
    }
  }, [setAuthToken]);
  
  // Build the user object from token if available
  const user = authToken ? {
    id: 'federated-user', // Would normally be extracted from the token
    email: 'user@example.com'  // Would normally be extracted from the token
  } : null;
  
  return {
    user,
    signIn,
    signOut,
    signInAsDev,
    authenticateWithToken,
    isLoading: contextLoading || isLoading,
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
