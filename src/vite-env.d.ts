
/// <reference types="vite/client" />

// Launchpad Federation Module declarations
declare module 'launchpad/Auth' {
  import React from 'react';
  
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
    }) => React.ReactNode;
  }
  
  const Auth: React.FC<AuthProps>;
  export default Auth;
}
