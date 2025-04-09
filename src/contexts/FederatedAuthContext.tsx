
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthModule, getFederatedAuthError } from '@/integrations/auth/federated-auth';
import { AuthModuleError, FederatedAuth } from '@/integrations/auth/types';
import { toast } from '@/hooks/use-toast';

interface FederatedAuthContextType {
  authModule: FederatedAuth;
  authError: AuthModuleError;
  isLoading: boolean;
}

const FederatedAuthContext = createContext<FederatedAuthContextType | undefined>(undefined);

export function FederatedAuthProvider({ children }: { children: React.ReactNode }) {
  const [authModule, authError] = getAuthModule();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check the status of the auth module on mount
  useEffect(() => {
    const checkAuthModule = async () => {
      try {
        // Wait a moment to ensure module federation has time to initialize
        setTimeout(() => {
          const [, currentError] = getAuthModule();
          
          if (currentError === 'network') {
            toast({
              title: 'Authentication Service Unavailable',
              description: 'Could not connect to the authentication service. Some features may be limited.',
              variant: 'destructive',
            });
          } else if (currentError === 'configuration') {
            console.warn('Auth module is not properly configured.');
          }
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setIsLoading(false);
      }
    };
    
    checkAuthModule();
  }, []);
  
  return (
    <FederatedAuthContext.Provider value={{ authModule, authError, isLoading }}>
      {children}
    </FederatedAuthContext.Provider>
  );
}

export function useFederatedAuth() {
  const context = useContext(FederatedAuthContext);
  if (context === undefined) {
    throw new Error('useFederatedAuth must be used within a FederatedAuthProvider');
  }
  return context;
}
