
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, Guest } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { EpisodeCardStatus } from './EpisodeCardStatus';
import { EpisodeCardBadges } from './EpisodeCardBadges';
import { EpisodeCardDates } from './EpisodeCardDates';
import { EpisodeGuestsList } from './EpisodeGuestsList';
import { EpisodePodcastLinks } from './EpisodePodcastLinks';
import { EpisodeCoverArt } from './EpisodeCoverArt';

interface EpisodeCardProps {
  episode: Episode;
  guests: Guest[];
  className?: string;
}

export function EpisodeCard({ episode, guests, className }: EpisodeCardProps) {
  // Get the guests for this episode
  const episodeGuests = guests.filter(guest => 
    episode.guestIds.includes(guest.id)
  );
  
  // Format the recording date
  const formattedRecordingDate = new Date(episode.scheduled).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Format the publish date if it exists
  const formattedPublishDate = episode.publishDate 
    ? new Date(episode.publishDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;
  
  return (
    <Link to={`/episodes/${episode.id}`}>
      <Card className={cn(
        "overflow-hidden hover-scale cursor-pointer group",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <EpisodeCardStatus status={episode.status} />
            
            <div className="flex-1 min-w-0">
              <EpisodeCardBadges 
                status={episode.status} 
                episodeNumber={episode.episodeNumber} 
              />
              
              <h3 className="font-medium text-lg truncate mb-2">{episode.title}</h3>
              
              <EpisodeCardDates 
                recordingDate={formattedRecordingDate} 
                publishDate={formattedPublishDate}
              />
              
              <EpisodeGuestsList guests={episodeGuests} />
              
              <EpisodePodcastLinks podcastUrls={episode.podcastUrls} />
              
              <p className="text-sm text-muted-foreground line-clamp-2">{episode.introduction}</p>
            </div>
            
            <EpisodeCoverArt 
              coverArt={episode.coverArt}
              title={episode.title}
            />
            
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
