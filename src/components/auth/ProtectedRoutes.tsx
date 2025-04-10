
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import React, { Suspense } from 'react';

// Import the Auth component from the remote module
const LaunchpadAuth = React.lazy(() => import('launchpad/Auth'));

export function ProtectedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading authentication...</div>}>
      <LaunchpadAuth
        render={(auth) => {
          // Check if auth.isLoading exists and handle accordingly
          if (auth.isLoading) {
            return <div className="flex items-center justify-center h-screen">Verifying authentication...</div>;
          }

          return auth.isAuthenticated ? (
            <Outlet />
          ) : (
            <Navigate to="/" state={{ from: location }} replace />
          );
        }}
      />
    </Suspense>
  );
}

export default ProtectedRoutes;
