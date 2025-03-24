
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  LayoutDashboard,
  Mic2,
  UserRound
} from 'lucide-react';

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Guests', href: '/guests', icon: UserRound },
  { name: 'Episodes', href: '/episodes', icon: Mic2 },
];

export function Navigation() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  return (
    <nav className="w-full md:w-56 px-2 py-4 md:py-8">
      <ul className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary'
                    : 'text-gray-600 hover:bg-primary/5 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/5 dark:hover:text-primary'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                  )}
                />
                <span className={cn(isMobile ? 'sr-only' : '', 'flex-1')}>{item.name}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
