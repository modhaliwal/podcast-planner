
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ 
  children, 
  className 
}: ResponsiveContainerProps) {
  return (
    <div 
      className={cn(
        "w-full mx-auto px-2 sm:px-4 md:px-6 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl", 
        className
      )}
    >
      {children}
    </div>
  );
}
