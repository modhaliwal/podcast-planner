
import { useFederatedAuth } from '@/contexts/FederatedAuthContext';

export function useAuthRedirect() {
  const { isAuthenticated } = useFederatedAuth();

  // No redirects needed as auth is handled at the app level
  return { 
    isAuthenticated
  };
}
