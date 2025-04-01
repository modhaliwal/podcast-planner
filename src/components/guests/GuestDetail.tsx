
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Guest, Episode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { GuestProfileCard } from './GuestProfileCard';
import { GuestAboutSection } from './GuestAboutSection';
import { GuestEpisodesList } from './GuestEpisodesList';

interface GuestDetailProps {
  guest: Guest;
  episodes: Episode[];
  className?: string;
}

export function GuestDetail({ guest, episodes, className }: GuestDetailProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to="/guests">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <GuestProfileCard guest={guest} />
        </div>
        
        <div className="flex-1 space-y-6">
          <GuestEpisodesList guest={guest} episodes={episodes} />
          <GuestAboutSection guest={guest} />
        </div>
      </div>
    </div>
  );
}
