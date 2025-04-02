
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FallbackProps, ErrorBoundaryProps } from './types';
import { DefaultErrorFallback } from './DefaultErrorFallback';

/**
 * Error Boundary component to catch errors in the component tree
 * and display a fallback UI instead of crashing the whole app
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean; error: Error | null }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, FallbackComponent = DefaultErrorFallback } = this.props;
    
    if (hasError) {
      const fallbackProps: FallbackProps = {
        error: error || new Error('Unknown error'),
        resetError: this.resetError
      };
      
      return <FallbackComponent {...fallbackProps} />;
    }

    return children;
  }
}
