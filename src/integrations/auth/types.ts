
// Types for the federated auth module
export interface FederatedAuth {
  useAuth: () => {
    user: any;
    isLoading: boolean;
    error: Error | null;
    signIn: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
  };
  usePermissions: () => {
    hasPermission: (permission: string) => boolean;
    userPermissions: string[];
    isLoading: boolean;
    error: Error | null;
  };
  FederatedModuleRoute: React.FC<{
    requiredPermission?: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }>;
  useIsAuthenticated: () => {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  useHasPermission: (permission: string) => {
    hasPermission: boolean;
    isLoading: boolean;
  };
}

export type AuthModuleError = "network" | "unavailable" | "configuration" | null;
