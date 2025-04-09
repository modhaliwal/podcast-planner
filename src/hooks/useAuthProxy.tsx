
import { useFederatedAuth } from '@/contexts/FederatedAuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// A proxy hook that combines the federated auth with fallback functionality
export function useAuthProxy() {
  const { authModule, authError, isLoading: contextLoading } = useFederatedAuth();
  const { useAuth } = authModule;
  const federatedAuth = useAuth();
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  
  // Determine overall loading state
  const isLoading = contextLoading || federatedAuth.isLoading || !initialized;
  
  // Handle auth module errors
  useEffect(() => {
    if (!contextLoading && authError) {
      console.warn(`Auth module error: ${authError}`);
    }
    setInitialized(true);
  }, [authError, contextLoading]);
  
  // Enhanced sign in with error handling
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
      
      const result = await federatedAuth.signIn(email, password);
      
      if (result.error) {
        toast({
          title: 'Authentication Failed',
          description: result.error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Authentication Successful',
          description: 'You have been signed in.',
        });
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
  
  // Enhanced sign out with error handling
  const signOut = async () => {
    try {
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
  };
}

// Proxy hook for checking authentication status
export function useIsAuthenticatedProxy() {
  const { authModule, authError, isLoading: contextLoading } = useFederatedAuth();
  const { useIsAuthenticated } = authModule;
  const { isAuthenticated, isLoading: authLoading } = useIsAuthenticated();
  
  return {
    isAuthenticated,
    isLoading: contextLoading || authLoading,
    authError,
  };
}

// Proxy hook for checking permissions
export function useHasPermissionProxy(permission: string) {
  const { authModule, authError, isLoading: contextLoading } = useFederatedAuth();
  const { useHasPermission } = authModule;
  const { hasPermission, isLoading: permissionLoading } = useHasPermission(permission);
  
  return {
    hasPermission,
    isLoading: contextLoading || permissionLoading,
    authError,
  };
}
