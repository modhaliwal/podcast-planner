
// Types for the federated auth module
export interface FederatedAuth {
  useAuth: () => {
    user: any;
    isLoading: boolean;
    error: Error | null;
    signIn: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
    // Add these properties for backward compatibility
    refreshGuests?: () => Promise<any[]>;
    refreshEpisodes?: (force?: boolean) => Promise<any[]>;
    refreshAllData?: () => Promise<void>;
    episodes?: any[];
    guests?: any[];
    isAuthenticated?: boolean;
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
  federatedSignIn?: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
}

export type AuthModuleError = "network" | "unavailable" | "configuration" | null;

// Add cross-domain token type for federation
export interface FederatedAuthToken {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}
