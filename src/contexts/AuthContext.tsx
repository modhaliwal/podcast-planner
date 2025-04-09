
import { createContext, useContext } from 'react';
import { useAuthProxy } from '@/hooks/useAuthProxy';
import { toast } from '@/hooks/use-toast';

// This is a temporary adapter file that redirects all AuthContext usage
// to the new federated auth system. This will help us transition smoothly.
// Eventually, all direct usages of AuthContext should be removed.

// Create a minimal context with the same interface as the old one
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.warn(
    'AuthProvider is deprecated and will be removed in a future update. ' +
    'Use FederatedAuthProvider instead.'
  );
  
  // Just pass through to children - we're not actually using this provider anymore
  return <>{children}</>;
};

// Adapter hook that uses the new federated auth
export const useAuth = () => {
  console.warn(
    'useAuth from AuthContext is deprecated and will be removed. ' +
    'Use useAuthProxy instead.'
  );
  
  const { user, isLoading, error } = useAuthProxy();
  
  // Return a compatible interface that will work with existing code
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    episodes: [], // Placeholder - should be fetched separately
    guests: [], // Placeholder - should be fetched separately
  };
};

// Temporary adapter for old code that relies on this
export const signOut = async () => {
  console.warn(
    'signOut from AuthContext is deprecated. ' +
    'Use useAuthProxy().signOut instead.'
  );
  
  const { signOut: fedSignOut } = useAuthProxy();
  await fedSignOut();
};
