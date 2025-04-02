
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { default: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  gap = "gap-3 sm:gap-4",
  className,
}: ResponsiveGridProps) {
  // Build grid classes based on provided columns
  const gridCols = [
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={cn("grid", gridCols, gap, className)}>
      {children}
    </div>
  );
}
