
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from './types';

interface NavigationProps {
  navItems: NavItem[];
}

export function Navigation({ navItems }: NavigationProps) {
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors",
            location.pathname === item.path
              ? "bg-primary/10 text-primary"
              : "text-foreground/80 hover:text-foreground hover:bg-accent"
          )}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
