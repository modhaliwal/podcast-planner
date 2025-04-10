
declare module 'launchpad/Auth' {
  import { ReactNode } from 'react';
  
  interface AuthProps {
    render: (authState: { 
      isAuthenticated: boolean; 
      isLoading: boolean;
      user?: {
        id: string;
        email?: string;
        name?: string;
        role?: string;
        permissions?: string[];
      };
    }) => ReactNode;
  }
  
  const Auth: React.ComponentType<AuthProps>;
  export default Auth;
}

declare module 'launchpad/UserProfile' {
  const UserProfile: React.ComponentType;
  export default UserProfile;
}

declare module 'launchpad/ProtectedRoute' {
  import { ReactNode } from 'react';
  
  interface ProtectedRouteProps {
    children: ReactNode;
    requiredPermissions?: string[];
    fallback?: ReactNode;
  }
  
  const ProtectedRoute: React.ComponentType<ProtectedRouteProps>;
  export default ProtectedRoute;
}
