
import { ReactNode } from 'react';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  size?: "default" | "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  noPadding?: boolean;
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  actions, 
  size = "default", 
  className,
  noPadding = false
}: PageLayoutProps) {
  return (
    <ResponsiveContainer size={size} className={className} noPadding={noPadding}>
      <div className="space-y-4 sm:space-y-5 md:space-y-6 py-3 sm:py-4 md:py-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-3 sm:pb-4 border-b">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
        
        {children}
      </div>
    </ResponsiveContainer>
  );
}
