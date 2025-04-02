
import { Link } from 'react-router-dom';
import { ChevronLeft, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Guest, Episode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { GuestProfileCard } from './GuestProfileCard';
import { GuestAboutSection } from './GuestAboutSection';
import { GuestEpisodesList } from './GuestEpisodesList';
import { ResponsiveContainer } from '@/components/ui/responsive-container';

interface GuestDetailProps {
  guest: Guest;
  episodes?: Episode[];
  className?: string;
  onDelete?: () => void;
}

export function GuestDetail({ guest, episodes = [], className, onDelete }: GuestDetailProps) {
  return (
    <ResponsiveContainer className={cn("page-container", className)}>
      <div className="flex flex-wrap items-center justify-between mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to="/guests">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/guests/${guest.id}/edit`}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>
      
      <div className="two-column-layout">
        <div className="sidebar-column">
          <GuestProfileCard guest={guest} />
        </div>
        
        <div className="main-column space-y-4 sm:space-y-6">
          <GuestEpisodesList guest={guest} episodes={episodes} />
          <GuestAboutSection guest={guest} />
        </div>
      </div>
    </ResponsiveContainer>
  );
}
