
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, Headphones, Home, Menu, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavItem } from './types';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { useAuthProxy } from '@/hooks/useAuthProxy';
import { PermissionGate } from '@/components/auth/PermissionGate';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthProxy();
  const isMobile = useIsMobile();
  
  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Guests', path: '/guests', icon: <Users className="h-4 w-4 mr-2" /> },
    { name: 'Episodes', path: '/episodes', icon: <Calendar className="h-4 w-4 mr-2" /> },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 py-2 sm:py-4 px-2 sm:px-4 md:px-6 transition-all duration-200",
      isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-subtle" : "bg-transparent"
    )}>
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Headphones className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="font-medium text-lg sm:text-xl">PodCast Manager</span>
          </Link>
        </div>
        
        {!isMobile && <Navigation />}
        
        <div className="flex items-center space-x-2">
          {!isLoading && !isAuthenticated && (
            <Button onClick={() => navigate('/auth')} variant="default" size="sm">
              Sign In
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          navItems={navItems}
          onClose={() => setIsMobileMenuOpen(false)}
          logoPath={isAuthenticated ? "/dashboard" : "/"}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </header>
  );
}
