
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageLayout({ children, title, subtitle, actions }: PageLayoutProps) {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="min-w-0">
          <h1 className="section-title truncate">{title}</h1>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      
      {children}
    </div>
  );
}
