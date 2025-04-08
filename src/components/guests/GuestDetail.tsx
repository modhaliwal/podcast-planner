import { Link } from 'react-router-dom';
import { ChevronLeft, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Guest, Episode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { GuestProfileCard } from './GuestProfileCard';
import { GuestAboutSection } from './GuestAboutSection';
import { GuestEpisodesList } from './GuestEpisodesList';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
interface GuestDetailProps {
  guest: Guest;
  episodes?: Episode[];
  className?: string;
  onDelete?: () => void;
}
export function GuestDetail({
  guest,
  episodes = [],
  className,
  onDelete
}: GuestDetailProps) {
  return <ResponsiveContainer className={cn("", className)}>
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
          
          {onDelete}
        </div>
      </div>
      
      <ResponsiveGrid cols={{
      default: 1,
      md: 3
    }} gap="gap-4 sm:gap-6">
        <div className="md:col-span-1">
          <GuestProfileCard guest={guest} />
        </div>
        
        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          <GuestEpisodesList guest={guest} episodes={episodes} />
          <GuestAboutSection guest={guest} />
        </div>
      </ResponsiveGrid>
    </ResponsiveContainer>;
}