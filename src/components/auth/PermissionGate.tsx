
import { ReactNode } from 'react';
import { useFederatedAuth } from '@/contexts/FederatedAuthContext';

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate = ({ 
  permission, 
  children, 
  fallback = null 
}: PermissionGateProps) => {
  const { authModule, authError } = useFederatedAuth();
  const { useHasPermission } = authModule;
  const { hasPermission, isLoading } = useHasPermission(permission);
  
  // If auth service is unavailable, show children with a warning
  if (authError) {
    console.warn(`Auth service unavailable: ${authError}. Permissive fallback used.`);
    return <>{children}</>;
  }
  
  // While loading, show nothing to avoid flashing content
  if (isLoading) {
    return null;
  }
  
  // Show content only if user has the required permission
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
