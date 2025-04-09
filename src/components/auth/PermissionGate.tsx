
import { ReactNode } from 'react';

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate = ({ 
  children
}: PermissionGateProps) => {
  // Since all authentication is removed, simply pass through the children
  return <>{children}</>;
};
