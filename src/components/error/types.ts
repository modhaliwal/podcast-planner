
import { ReactNode, ErrorInfo } from 'react';

export interface FallbackProps {
  error: Error;
  resetError: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
