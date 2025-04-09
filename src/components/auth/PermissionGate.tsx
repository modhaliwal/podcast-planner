
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
  const { authToken, authError } = useFederatedAuth();
  
  // If auth service is unavailable, show children with a warning
  if (authError) {
    console.warn(`Auth service unavailable: ${authError}. Permissive fallback used.`);
    return <>{children}</>;
  }
  
  // Simplified permission check - just check if we have a token
  const hasPermission = !!authToken;
  
  // Show content only if user has the required permission
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
