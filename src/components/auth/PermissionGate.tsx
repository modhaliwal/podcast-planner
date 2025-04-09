
import { ReactNode } from 'react';

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate = ({ 
  children
}: PermissionGateProps) => {
  // Since permissions are now handled at the app level,
  // we simply pass through the children
  return <>{children}</>;
};
