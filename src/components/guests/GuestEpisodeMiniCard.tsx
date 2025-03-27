
import { format } from 'date-fns';
import { Episode } from '@/lib/types';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EpisodeStatus } from '@/lib/enums';

interface GuestEpisodeMiniCardProps {
  episode: Episode;
}

export function GuestEpisodeMiniCard({ episode }: GuestEpisodeMiniCardProps) {
  // Status colors
  const statusColors = {
    [EpisodeStatus.SCHEDULED]: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    [EpisodeStatus.RECORDED]: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    [EpisodeStatus.PUBLISHED]: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  };

  return (
    <div className="relative flex flex-col bg-card border rounded-md p-2.5 shadow-sm w-full overflow-hidden">
      {/* Cover art as background image */}
      {episode.coverArt && (
        <div 
          className="absolute top-0 right-0 h-full w-1/2 bg-contain bg-no-repeat bg-right-top" 
          style={{ 
            backgroundImage: `url(${episode.coverArt})`,
            opacity: 0.15
          }}
        />
      )}
      
      <div className="relative flex items-center gap-2">
        <div className={cn(
          "h-8 w-8 shrink-0 rounded-full flex items-center justify-center",
          statusColors[episode.status] || "bg-gray-100 text-gray-600"
        )}>
          <Calendar className="h-4 w-4" />
        </div>
        <div className="min-w-0 w-full">
          <div className="font-medium text-sm truncate">#{episode.episodeNumber} {episode.title}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="capitalize">{episode.status}</span>
            <span className="mx-1.5">•</span>
            <span>{format(new Date(episode.scheduled), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
