
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Headphones, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
          <Link to="/" className="flex items-center space-x-2">
            <Headphones className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="font-medium text-lg sm:text-xl">PodCast Manager</span>
          </Link>
        </div>
        
        {!isMobile && <Navigation />}
        
        <div className="flex items-center gap-2">
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
          navItems={navigationItems}
          onClose={() => setIsMobileMenuOpen(false)}
          logoPath="/"
        />
      </div>
    </header>
  );
}

// Import the navigation items to use in MobileMenu
import {
  LayoutDashboard,
  UserRound, 
  Mic2,
  Settings
} from 'lucide-react';

// Define navigation items that match Navigation.tsx
const navigationItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
  { name: 'Guests', path: '/guests', icon: <UserRound className="mr-2 h-4 w-4" /> },
  { name: 'Episodes', path: '/episodes', icon: <Mic2 className="mr-2 h-4 w-4" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="mr-2 h-4 w-4" /> },
];
