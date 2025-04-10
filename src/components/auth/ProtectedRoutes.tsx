
import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const LaunchpadAuth = React.lazy(() => import('auth/Auth'));

interface LaunchpadAuthType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ProtectedRoutes = () => {
  const [authState, setAuthState] = useState<LaunchpadAuthType>({
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // This empty useEffect ensures the component re-renders when the LaunchpadAuth module loads
  }, []);

  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading authentication...</div>}>
      <LaunchpadAuth
        render={(auth: LaunchpadAuthType) => {
          if (auth.isLoading) {
            return <div className="h-screen w-full flex items-center justify-center">Verifying authentication...</div>;
          }

          return auth.isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
        }}
      />
    </Suspense>
  );
};

export default ProtectedRoutes;
