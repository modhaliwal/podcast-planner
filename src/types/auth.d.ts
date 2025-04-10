
declare module 'auth/Auth' {
  import { ReactNode } from 'react';
  
  interface AuthProps {
    render: (authState: { 
      isAuthenticated: boolean; 
      isLoading: boolean;
      user?: {
        id: string;
        email?: string;
        name?: string;
      };
    }) => ReactNode;
  }
  
  const Auth: React.ComponentType<AuthProps>;
  export default Auth;
}

declare module 'auth/UserProfile' {
  const UserProfile: React.ComponentType;
  export default UserProfile;
}
