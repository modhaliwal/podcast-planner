import { useEffect } from 'react';
import { useFederatedAuth } from '@/contexts/FederatedAuthContext';
import { toast } from '@/hooks/use-toast';

/**
 * Component that handles auth-related notifications
 * Follows the separation of concerns principle by keeping UI notifications
 * separate from the auth context implementation
 */
export function AuthErrorNotification() {
  const { authErrorType } = useFederatedAuth();
  
  useEffect(() => {
    if (authErrorType === 'network') {
      toast({
        title: 'Authentication Service Unavailable',
        description: 'Could not connect to the authentication service. Some features may be limited.',
        variant: 'destructive',
      });
    } else if (authErrorType === 'configuration') {
      console.warn('Auth module is not properly configured.');
      toast({
        title: 'Authentication Configuration Issue',
        description: 'The authentication system is not properly configured.',
        variant: 'destructive',
      });
    }
  }, [authErrorType]);
  
  // This component doesn't render anything
  return null;
} 