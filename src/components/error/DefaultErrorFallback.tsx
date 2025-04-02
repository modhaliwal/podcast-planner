
import { Button } from '@/components/ui/button';
import { FallbackProps } from './types';
import { RefreshCw } from 'lucide-react';

export function DefaultErrorFallback({ error, resetError }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-md border bg-background">
      <div className="text-destructive mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4 max-w-md text-center">
        An error occurred while rendering this component
      </p>
      <div className="bg-muted p-4 rounded-md mb-4 max-w-md overflow-auto">
        <code className="text-sm whitespace-pre-wrap">{error.message}</code>
      </div>
      <Button onClick={resetError} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
