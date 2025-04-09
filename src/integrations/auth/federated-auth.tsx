
import { lazy, Suspense, ReactNode } from 'react';
import { AuthModuleError, FederatedAuth } from './types';

// Default fallback values when federation fails
const fallbackAuth: FederatedAuth = {
  useAuth: () => ({
    user: null,
    isLoading: false,
    error: new Error("Auth module unavailable"),
    signIn: async () => ({ error: { message: "Auth module unavailable" } }),
    signOut: async () => {},
    refreshGuests: async () => [],
    refreshEpisodes: async () => [],
    refreshAllData: async () => {},
    episodes: [],
    guests: [],
    isAuthenticated: false
  }),
  usePermissions: () => ({
    hasPermission: () => false,
    userPermissions: [],
    isLoading: false,
    error: new Error("Auth module unavailable"),
  }),
  FederatedModuleRoute: ({ fallback, children }) => fallback || children || null,
  useIsAuthenticated: () => ({
    isAuthenticated: false,
    isLoading: false,
  }),
  useHasPermission: () => ({
    hasPermission: false,
    isLoading: false,
  }),
  federatedSignIn: async (email, password) => ({ 
    error: { message: "Auth module unavailable" }
  }),
  signIn: async (email, password) => ({ 
    error: { message: "Auth module unavailable" }
  }),
};

// Create a lazy loaded module with error handling
let authModuleError: AuthModuleError = null;

// Create a wrapper component that will be lazy loaded
const AuthModuleWrapper = ({ children }: { children: ReactNode }) => {
  // This is a simple component that just renders its children
  // It serves as our ComponentType for lazy loading
  return <>{children}</>;
};

// Properly type the module for lazy loading
const FederatedAuthModuleLoader = lazy(() => 
  import('auth/module')
    .then((module) => {
      // Return a component that renders our auth module
      return { 
        default: ({ children }: { children: ReactNode }) => {
          return <AuthModuleWrapper>{children}</AuthModuleWrapper>;
        }
      };
    })
    .catch(err => {
      console.error('Failed to load auth module:', err);
      authModuleError = 'unavailable';
      // Return a component that just provides our fallback
      return { 
        default: ({ children }: { children: ReactNode }) => {
          return <AuthModuleWrapper>{children}</AuthModuleWrapper>;
        }
      };
    })
);

// Exported function to get the auth module
export const getAuthModule = (): [FederatedAuth, AuthModuleError] => {
  try {
    // This will throw an error if the module is not loaded yet
    // Use dynamic import with a type annotation
    const module = require('auth/module');
    return [module as FederatedAuth, authModuleError];
  } catch (e) {
    // Module not loaded or unavailable
    return [fallbackAuth, authModuleError || 'configuration'];
  }
};

// Add direct export for federatedSignIn to match expected API
export const federatedSignIn = async (email: string, password: string) => {
  try {
    const [authModule] = getAuthModule();
    return await authModule.signIn(email, password);
  } catch (error) {
    console.error('Federation sign in error:', error);
    return { error: { message: 'Authentication service unavailable' } };
  }
};

// Federation token validation
export const validateFederationToken = async (token: string): Promise<boolean> => {
  try {
    // In a real implementation, this would call an API to validate the token
    // For now, we'll just check if it exists
    return !!token;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Function to initiate federation auth with the launchpad
export const initiateFederatedAuth = (callbackUrl: string): void => {
  // In a real implementation, this would redirect to the launchpad auth page
  const authUrl = "https://admin.skyrocketdigital.com/auth";
  window.location.href = `${authUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
};

// Wrapper component to provide auth module with proper error handling
export function withFederatedAuth<T extends object>(
  Component: React.ComponentType<T & { authModule: FederatedAuth }>
): React.FC<T> {
  return (props: T) => {
    return (
      <Suspense fallback={<div className="flex items-center justify-center p-4">Loading authentication...</div>}>
        <FederatedAuthModuleLoader>
          <Component {...props} authModule={fallbackAuth} />
        </FederatedAuthModuleLoader>
      </Suspense>
    );
  };
}

export const getFederatedAuthError = (): AuthModuleError => authModuleError;
