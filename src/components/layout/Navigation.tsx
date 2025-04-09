
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  LayoutDashboard,
  Mic2,
  Settings,
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
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary'
                    : 'text-gray-600 hover:bg-primary/5 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/5 dark:hover:text-primary'
                )}
              >
                <item.icon
                  className={cn(
                    'h-4 w-4',
                    isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                  )}
                />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="h-3 w-3 ml-1" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
