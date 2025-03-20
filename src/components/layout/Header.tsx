
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, Headphones, Home, LogOut, Menu, User, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
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
        
        <div className="flex items-center space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{getInitials(user.user_metadata?.full_name || user.email || '')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        
        {/* Mobile Menu */}
        <div className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-200",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className={cn(
            "fixed inset-y-0 right-0 w-full max-w-xs bg-background p-6 shadow-lg transform transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="flex items-center justify-between mb-8">
              <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                <Headphones className="h-6 w-6 text-primary" />
                <span className="font-medium text-xl">PodCast Manager</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              {!user && (
                <Link 
                  to="/auth"
                  className="px-4 py-3 rounded-md text-base font-medium flex items-center bg-primary text-primary-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              )}
              
              {user && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
