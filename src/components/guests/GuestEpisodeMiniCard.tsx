
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
    <div className="flex flex-col bg-card border rounded-md p-2.5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          statusColors[episode.status] || "bg-gray-100 text-gray-600"
        )}>
          <Calendar className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-sm">Episode #{episode.episodeNumber}</span>
            {episode.episodeNumber !== Number(episode.title.match(/#(\d+)/)?.[1]) && (
              <span className="text-xs text-muted-foreground">({episode.title})</span>
            )}
          </div>
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
