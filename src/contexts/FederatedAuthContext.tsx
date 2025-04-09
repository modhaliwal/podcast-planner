
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthModule } from '@/integrations/auth/federated-auth';
import { AuthModuleError, FederatedAuth, FederatedAuthToken } from '@/integrations/auth/types';

// Types for auth context
interface FederatedAuthContextType {
  authModule: FederatedAuth;
  isLoading: boolean;
  authToken: FederatedAuthToken | null;
  setAuthToken: (token: FederatedAuthToken | null) => void;
  hasAuthError: boolean;
  authErrorType: AuthModuleError | null;
  authError: Error | null; // Add authError property for backward compatibility
}

// Create the context
const FederatedAuthContext = createContext<FederatedAuthContextType | undefined>(undefined);

// Helper function to get token from local storage
const getStoredToken = (): FederatedAuthToken | null => {
  try {
    const tokenStr = localStorage.getItem('auth_token');
    if (!tokenStr) return null;
    return JSON.parse(tokenStr);
  } catch (error) {
    console.error('Error parsing stored auth token:', error);
    return null;
  }
};

export function FederatedAuthProvider({ children }: { children: React.ReactNode }) {
  const [authModule, authError] = getAuthModule();
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthTokenState] = useState<FederatedAuthToken | null>(getStoredToken());
  const [authErrorType, setAuthErrorType] = useState<AuthModuleError | null>(null);
  
  // Function to set token and persist to localStorage
  const setAuthToken = (token: FederatedAuthToken | null) => {
    if (token) {
      localStorage.setItem('auth_token', JSON.stringify(token));
    } else {
      localStorage.removeItem('auth_token');
    }
    setAuthTokenState(token);
  };
  
  // Check the status of the auth module on mount
  useEffect(() => {
    const checkAuthModule = async () => {
      try {
        // Wait a moment to ensure module federation has time to initialize
        setTimeout(() => {
          const [, currentError] = getAuthModule();
          setAuthErrorType(currentError);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setIsLoading(false);
      }
    };
    
    checkAuthModule();
  }, []);

  // Check for token expiration
  useEffect(() => {
    if (authToken?.expires_at && authToken.expires_at < Date.now()) {
      console.warn('Auth token expired, clearing session');
      setAuthToken(null);
    }
  }, [authToken]);
  
  // Create the context value
  const contextValue: FederatedAuthContextType = {
    authModule,
    isLoading,
    authToken,
    setAuthToken,
    hasAuthError: authErrorType !== null,
    authErrorType,
    authError: authError // Expose authError for backward compatibility
  };
  
  return (
    <FederatedAuthContext.Provider value={contextValue}>
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
