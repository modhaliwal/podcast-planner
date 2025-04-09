
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticatedProxy } from '@/hooks/useAuthProxy';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, authError } = useIsAuthenticatedProxy();
  const location = useLocation();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Verifying authentication...</p>
      </div>
    </div>;
  }

  // If auth service is unavailable but the route requires authentication
  if (authError) {
    toast({
      title: "Authentication Service Unavailable",
      description: "Unable to verify your authentication status. Some features may be limited.",
      variant: "destructive"
    });
    
    // We'll allow access with a warning for UX purposes
    return <>{children}</>;
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to continue",
      variant: "destructive"
    });
    
    // Redirect to auth page, preserving the intended destination
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If we need to check permissions, do so here
  if (requiredPermission) {
    const { useHasPermissionProxy } = require('@/hooks/useAuthProxy');
    const { hasPermission, isLoading: permissionLoading } = useHasPermissionProxy(requiredPermission);
    
    if (permissionLoading) {
      return <div className="flex items-center justify-center min-h-screen">
        <p>Checking permissions...</p>
      </div>;
    }
    
    if (!hasPermission) {
      toast({
        title: "Access Denied",
        description: `You don't have the required permission: ${requiredPermission}`,
        variant: "destructive"
      });
      
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
