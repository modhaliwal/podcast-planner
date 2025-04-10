
/// <reference types="vite/client" />

// Auth Remote Module declarations for Launchpad Federation
declare module 'auth/Auth' {
  import React from 'react';
  
  interface AuthProps {
    render: (authState: { isAuthenticated: boolean }) => React.ReactNode;
  }
  
  const Auth: React.FC<AuthProps>;
  export default Auth;
}
