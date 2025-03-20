
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

interface LoadingIndicatorProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingIndicator({ 
  message = "Loading...", 
  fullPage = false 
}: LoadingIndicatorProps) {
  const [progress, setProgress] = useState(10);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(30), 200);
    const timer2 = setTimeout(() => setProgress(60), 600);
    const timer3 = setTimeout(() => setProgress(80), 1000);
    const timer4 = setTimeout(() => setProgress(90), 1500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);
  
  const containerClasses = fullPage 
    ? "flex flex-col items-center justify-center min-h-[60vh]" 
    : "flex flex-col items-center py-8";
  
  return (
    <div className={containerClasses}>
      <div className="w-64 space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{message}</p>
          <span className="text-sm font-mono text-muted-foreground">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}
