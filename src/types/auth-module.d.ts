declare module 'auth/module' {
  import { FederatedAuth } from '../integrations/auth/types';
  
  // Export named exports to match expected API
  export const useAuth: FederatedAuth['useAuth'];
  export const usePermissions: FederatedAuth['usePermissions'];
  export const FederatedModuleRoute: FederatedAuth['FederatedModuleRoute'];
  export const useIsAuthenticated: FederatedAuth['useIsAuthenticated'];
  export const useHasPermission: FederatedAuth['useHasPermission'];
  export const federatedSignIn: FederatedAuth['federatedSignIn'];
  
  // Keep default export for backward compatibility
  const module: FederatedAuth;
  export default module;
}
