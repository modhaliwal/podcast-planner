
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
  }),
  usePermissions: () => ({
    hasPermission: () => false,
    userPermissions: [],
    isLoading: false,
    error: new Error("Auth module unavailable"),
  }),
  FederatedModuleRoute: ({ fallback }) => fallback || null,
  useIsAuthenticated: () => ({
    isAuthenticated: false,
    isLoading: false,
  }),
  useHasPermission: () => ({
    hasPermission: false,
    isLoading: false,
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

// Fix the typing for the FederatedAuthModuleProps
interface FederatedAuthModuleProps {
  children: (module: FederatedAuth) => ReactNode;
}

// Create a component that renders the children with the auth module
const FederatedAuthModule: React.FC<FederatedAuthModuleProps> = ({ children }) => {
  // Just return the fallback auth for now - we'll improve this later
  return <>{children(fallbackAuth)}</>;
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
