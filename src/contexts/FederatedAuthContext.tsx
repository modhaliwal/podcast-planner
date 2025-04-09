import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { AuthModuleError, FederatedAuthToken } from '@/integrations/auth/types';
import { LaunchpadConfig } from '@/config/launchpad';
import { getAuthModule } from '@/integrations/auth/federated-auth';

// Types for auth context
interface FederatedAuthContextType {
  authModule: any;
  isLoading: boolean;
  authToken: FederatedAuthToken | null;
  setAuthToken: (token: FederatedAuthToken | null) => void;
  hasAuthError: boolean;
  authErrorType: AuthModuleError | null;
  authError: Error | null;
  logout: () => void;
  isAuthenticated: boolean;
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

// Helper function to validate token
const isTokenValid = (token: FederatedAuthToken | null): boolean => {
  if (!token || !token.expires_at) return false;
  return token.expires_at > Date.now();
};

export function FederatedAuthProvider({ children }: { children: React.ReactNode }) {
  // Get the federated auth module
  const [authModule, moduleError] = getAuthModule();
  
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthTokenState] = useState<FederatedAuthToken | null>(getStoredToken());
  const [authErrorType, setAuthErrorType] = useState<AuthModuleError | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Function to set token and persist to localStorage
  const setAuthToken = (token: FederatedAuthToken | null) => {
    if (token) {
      localStorage.setItem('auth_token', JSON.stringify(token));
      
      // Also store the token in the storage specified by Launchpad
      if (token.access_token) {
        localStorage.setItem(LaunchpadConfig.storageKeys.token, token.access_token);
      }
      if (token.refresh_token) {
        localStorage.setItem(LaunchpadConfig.storageKeys.refreshToken, token.refresh_token);
      }
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem(LaunchpadConfig.storageKeys.token);
      localStorage.removeItem(LaunchpadConfig.storageKeys.refreshToken);
    }
    setAuthTokenState(token);
  };
  
  // Logout function
  const logout = () => {
    setAuthToken(null);
    navigate('/auth', { replace: true });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Process tokens that might be in URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token");
    
    if (urlToken && location.pathname !== '/auth') {
      console.log("Token detected in non-auth route, redirecting to /auth with params");
      // Redirect to /auth with all current parameters preserved
      navigate({
        pathname: '/auth',
        search: location.search
      }, { replace: true });
    }
  }, [location, navigate]);
  
  // Check the status of the auth module on mount
  useEffect(() => {
    // Set it as not loading after a short delay
    setTimeout(() => {
      setAuthErrorType(moduleError);
      setIsLoading(false);
    }, 500);
  }, [moduleError]);

  // Check for token expiration
  useEffect(() => {
    if (authToken?.expires_at && authToken.expires_at < Date.now()) {
      console.warn('Auth token expired, clearing session');
      setAuthToken(null);
      
      // Only show toast and redirect if not already on auth page
      if (location.pathname !== '/auth') {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive"
        });
        
        navigate('/auth', { 
          state: { from: location.pathname },
          replace: true 
        });
      }
    }
  }, [authToken, location.pathname, navigate]);
  
  // Setup token refresh
  useEffect(() => {
    if (authToken && authToken.expires_at) {
      const timeToExpiry = authToken.expires_at - Date.now();
      const refreshTime = timeToExpiry - (LaunchpadConfig.tokenRefresh.refreshBeforeExpiryMinutes * 60 * 1000);
      
      if (refreshTime <= 0) {
        // Token is already expired or about to expire
        return;
      }
      
      const refreshTimer = setTimeout(() => {
        // This is a simple refresh by extending the expiry
        // In a real implementation, you'd call an API to refresh the token
        if (authToken.refresh_token) {
          console.log("Would refresh token here using refresh_token");
          // For now, just extend the expiry
          setAuthToken({
            ...authToken,
            expires_at: Date.now() + (3600 * 1000) // extend by 1 hour
          });
        }
      }, refreshTime);
      
      return () => clearTimeout(refreshTimer);
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
    isAuthenticated: isTokenValid(authToken),
    logout,
    // Convert moduleError to Error type
    authError: moduleError ? new Error(String(moduleError)) : null
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
