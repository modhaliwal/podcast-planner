
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthModule } from '@/integrations/auth/federated-auth';
import { AuthModuleError, FederatedAuth, FederatedAuthToken } from '@/integrations/auth/types';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Types for auth context
interface FederatedAuthContextType {
  authModule: FederatedAuth;
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
    } else {
      localStorage.removeItem('auth_token');
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
    const urlRefreshToken = searchParams.get("refresh_token");
    const redirectTo = searchParams.get("redirectTo") || "/dashboard";
    
    if (urlToken && urlRefreshToken) {
      // Create a token object from URL parameters
      const newToken: FederatedAuthToken = {
        access_token: urlToken,
        refresh_token: urlRefreshToken,
        expires_at: Date.now() + (3600 * 1000) // Default to 1 hour if not specified
      };
      
      // Save the token
      setAuthToken(newToken);
      
      // Clean up URL by removing auth parameters
      const cleanParams = new URLSearchParams(location.search);
      cleanParams.delete("token");
      cleanParams.delete("refresh_token");
      
      // Replace current URL without reloading
      const newUrl = location.pathname + 
        (cleanParams.toString() ? '?' + cleanParams.toString() : '') +
        location.hash;
      
      window.history.replaceState({}, '', newUrl);
      
      // Navigate to the redirectTo parameter if available
      if (redirectTo && redirectTo !== '/auth' && redirectTo !== location.pathname) {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [location, navigate]);
  
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
      const refreshTime = timeToExpiry - (5 * 60 * 1000); // 5 minutes before expiry
      
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
    authError: moduleError ? 
      (typeof moduleError === 'object' && moduleError !== null ? 
        new Error(String(moduleError)) : 
        new Error(String(moduleError))
      ) : null
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
