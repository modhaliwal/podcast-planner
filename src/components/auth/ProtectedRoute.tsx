
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Since all authentication is removed, simply pass through the children
  return <>{children}</>;
};
