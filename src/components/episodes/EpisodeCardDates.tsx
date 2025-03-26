
import React from 'react';
import { Clock, CalendarDays } from 'lucide-react';

interface EpisodeCardDatesProps {
  recordingDate: string;
  publishDate?: string | null;
}

export function EpisodeCardDates({ recordingDate, publishDate }: EpisodeCardDatesProps) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <div className="flex items-center">
        <Clock className="h-3 w-3 text-muted-foreground mr-1" />
        <span className="text-xs text-muted-foreground">Recording: {recordingDate}</span>
      </div>
      
      {publishDate && (
        <div className="flex items-center">
          <CalendarDays className="h-3 w-3 text-muted-foreground mr-1" />
          <span className="text-xs text-muted-foreground">Publish: {publishDate}</span>
        </div>
      )}
    </div>
  );
}
