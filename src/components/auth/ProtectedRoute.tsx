
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Since authentication is handled at the app level, 
  // we simply pass through the children
  return <>{children}</>;
};
