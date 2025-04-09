
import { X, LogOut, Headphones, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavItem } from './types';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
  onSignOut: () => void;
  logoPath: string;
  isAuthenticated: boolean;
}

export function MobileMenu({ 
  isOpen, 
  navItems, 
  onClose, 
  onSignOut, 
  logoPath, 
  isAuthenticated 
}: MobileMenuProps) {
  const location = useLocation();
  
  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-200",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className={cn(
        "fixed inset-y-0 right-0 w-full max-w-xs bg-background p-6 shadow-lg transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-8">
          <Link to={logoPath} className="flex items-center space-x-2" onClick={onClose}>
            <Headphones className="h-6 w-6 text-primary" />
            <span className="font-medium text-xl">PodCast Manager</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "px-4 py-3 rounded-md text-base font-medium flex items-center",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:text-foreground hover:bg-accent"
              )}
              onClick={onClose}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          
          {!isAuthenticated && (
            <Link 
              to="/auth"
              className="px-4 py-3 rounded-md text-base font-medium flex items-center bg-primary text-primary-foreground"
              onClick={onClose}
            >
              <Home className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          )}
          
          {isAuthenticated && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                onSignOut();
                onClose();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          )}
        </nav>
      </div>
    </div>
  );
}
