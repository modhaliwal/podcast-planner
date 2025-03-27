
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Beaker, Calendar, Headphones, Home, Menu, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { NavItem } from './types';
import { Navigation } from './Navigation';
import { UserDropdown } from './UserDropdown';
import { MobileMenu } from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  
  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Guests', path: '/guests', icon: <Users className="h-4 w-4 mr-2" /> },
    { name: 'Episodes', path: '/episodes', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { name: 'Sandbox', path: '/sandbox', icon: <Beaker className="h-4 w-4 mr-2" /> },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error signing out. Please try again.");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-6 transition-all duration-200",
      isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-subtle" : "bg-transparent"
    )}>
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="font-medium text-xl">PodCast Manager</span>
          </Link>
        </div>
        
        {!isMobile && <Navigation />}
        
        <div className="flex items-center space-x-2">
          {user ? (
            <UserDropdown 
              user={user} 
              onSignOut={handleSignOut} 
              getInitials={getInitials} 
            />
          ) : (
            <Button onClick={() => navigate('/auth')} variant="default" size="sm">
              <User className="h-4 w-4 mr-2" />
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
          onSignOut={handleSignOut}
          logoPath={user ? "/dashboard" : "/"}
          user={user}
        />
      </div>
    </header>
  );
}
