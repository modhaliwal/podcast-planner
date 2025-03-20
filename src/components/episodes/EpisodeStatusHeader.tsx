
import { Calendar, Clock, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Episode } from '@/lib/types';
import { EpisodeStatus } from '@/lib/enums';

interface EpisodeStatusHeaderProps {
  episode: Episode;
}

export function EpisodeStatusHeader({ episode }: EpisodeStatusHeaderProps) {
  // Format dates
  const formattedRecordingDate = new Date(episode.scheduled).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedRecordingTime = new Date(episode.scheduled).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedPublishDate = episode.publishDate 
    ? new Date(episode.publishDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className={cn(
        "h-16 w-16 rounded-xl flex items-center justify-center shrink-0",
        episode.status === EpisodeStatus.PUBLISHED ? "bg-green-100 text-green-700" :
        episode.status === EpisodeStatus.RECORDED ? "bg-blue-100 text-blue-700" :
        "bg-orange-100 text-orange-700"
      )}>
        <Calendar className="h-8 w-8" />
      </div>
      
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={
            episode.status === EpisodeStatus.PUBLISHED ? "default" :
            episode.status === EpisodeStatus.RECORDED ? "secondary" :
            "outline"
          }>
            {episode.status}
          </Badge>
          
          <Badge variant="outline" className="font-mono">
            Episode #{episode.episodeNumber}
          </Badge>
        </div>
        
        <h1 className="text-2xl font-semibold mb-4">{episode.title}</h1>
        
        <div className="space-y-4">
          {/* Recording Date and Time */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm font-medium text-muted-foreground">Recording:</span>
            </div>
            <span className="text-sm bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
              {formattedRecordingDate} at {formattedRecordingTime}
            </span>
          </div>
          
          {/* Publish Date */}
          {formattedPublishDate && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm font-medium text-muted-foreground">Publish Date:</span>
              </div>
              <span className="text-sm bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                {formattedPublishDate}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
