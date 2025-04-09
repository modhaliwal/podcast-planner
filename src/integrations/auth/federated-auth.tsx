
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

// We need to properly type the module to avoid errors
type ModuleType = {
  default: FederatedAuth;
};

// Create a component that will render the federated module
const FederatedAuthModuleLoader = lazy<() => Promise<ModuleType>>(() => {
  return import('auth/module')
    .then(module => ({ default: module }))
    .catch(err => {
      console.error('Failed to load auth module:', err);
      authModuleError = 'unavailable';
      return { default: fallbackAuth };
    });
});

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
export function withFederatedAuth<T>(
  Component: React.ComponentType<T & { authModule: FederatedAuth }>
): React.FC<T> {
  return (props: T) => {
    return (
      <Suspense fallback={<div className="flex items-center justify-center p-4">Loading authentication...</div>}>
        <FederatedAuthModuleLoader />
        {/* We can't use children like this with a lazy component, so we need to render differently */}
        <Component {...props} authModule={fallbackAuth} />
      </Suspense>
    );
  };
}

export const getFederatedAuthError = (): AuthModuleError => authModuleError;
