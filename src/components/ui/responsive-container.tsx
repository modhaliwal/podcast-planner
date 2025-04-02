
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "sm" | "md" | "lg" | "xl" | "full";
  noPadding?: boolean;
}

export function ResponsiveContainer({ 
  children, 
  className,
  size = "default",
  noPadding = false
}: ResponsiveContainerProps) {
  // Define width constraints based on size
  const sizeClasses = {
    default: "md:max-w-3xl lg:max-w-4xl xl:max-w-5xl",
    sm: "md:max-w-2xl lg:max-w-3xl",
    md: "md:max-w-3xl lg:max-w-4xl",
    lg: "md:max-w-4xl lg:max-w-5xl",
    xl: "md:max-w-5xl lg:max-w-6xl",
    full: "max-w-full", // No width constraint
  };
  
  // Determine padding based on noPadding prop - reduced padding for mobile
  const paddingClasses = noPadding 
    ? "" 
    : "px-1 sm:px-2 md:px-3";

  return (
    <div 
      className={cn(
        "w-full mx-auto", 
        paddingClasses,
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
