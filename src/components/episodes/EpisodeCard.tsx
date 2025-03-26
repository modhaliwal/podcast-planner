
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, CalendarDays, Clock, Image, Music, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, Guest } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { EpisodeStatus } from '@/lib/enums';
import { GuestChip } from '@/components/guests/GuestChip';

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
  
  // Check if any podcast URLs exist
  const hasPodcastUrls = episode.podcastUrls && (
    episode.podcastUrls.spotify || 
    episode.podcastUrls.applePodcasts || 
    episode.podcastUrls.amazonPodcasts || 
    episode.podcastUrls.youtube
  );

  const handlePodcastLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <Link to={`/episodes/${episode.id}`}>
      <Card className={cn(
        "overflow-hidden hover-scale cursor-pointer group",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
              episode.status === EpisodeStatus.PUBLISHED ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
              episode.status === EpisodeStatus.RECORDED ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
              "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
            )}>
              <Calendar className="h-6 w-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={
                  episode.status === EpisodeStatus.PUBLISHED ? "default" :
                  episode.status === EpisodeStatus.RECORDED ? "secondary" :
                  "outline"
                }>
                  {episode.status}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  Ep #{episode.episodeNumber}
                </Badge>
              </div>
              
              <h3 className="font-medium text-lg truncate mb-2">{episode.title}</h3>
              
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">Recording: {formattedRecordingDate}</span>
                </div>
                
                {formattedPublishDate && (
                  <div className="flex items-center">
                    <CalendarDays className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">Publish: {formattedPublishDate}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {episodeGuests.length > 0 ? (
                  <>
                    {episodeGuests.slice(0, 3).map((guest) => (
                      <GuestChip 
                        key={guest.id} 
                        guest={guest} 
                        size="sm" 
                        showLink={false}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `/guests/${guest.id}`;
                        }}
                      />
                    ))}
                    
                    {episodeGuests.length > 3 && (
                      <Badge variant="outline">
                        +{episodeGuests.length - 3} more
                      </Badge>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No guests</span>
                )}
              </div>
              
              {/* Podcast links */}
              {hasPodcastUrls && (
                <div className="flex flex-wrap gap-3 py-2 mb-3 border-y border-border">
                  {episode.podcastUrls?.spotify && (
                    <a 
                      href={episode.podcastUrls.spotify}
                      onClick={(e) => handlePodcastLinkClick(e, episode.podcastUrls!.spotify!)}
                      className="flex items-center text-sm text-primary relative z-10"
                    >
                      <Music className="h-4 w-4 mr-1.5" />
                      <span>Spotify</span>
                    </a>
                  )}
                  
                  {episode.podcastUrls?.applePodcasts && (
                    <a 
                      href={episode.podcastUrls.applePodcasts}
                      onClick={(e) => handlePodcastLinkClick(e, episode.podcastUrls!.applePodcasts!)}
                      className="flex items-center text-sm text-primary relative z-10"
                    >
                      <Music className="h-4 w-4 mr-1.5" />
                      <span>Apple</span>
                    </a>
                  )}
                  
                  {episode.podcastUrls?.amazonPodcasts && (
                    <a 
                      href={episode.podcastUrls.amazonPodcasts}
                      onClick={(e) => handlePodcastLinkClick(e, episode.podcastUrls!.amazonPodcasts!)}
                      className="flex items-center text-sm text-primary relative z-10"
                    >
                      <Music className="h-4 w-4 mr-1.5" />
                      <span>Amazon</span>
                    </a>
                  )}
                  
                  {episode.podcastUrls?.youtube && (
                    <a 
                      href={episode.podcastUrls.youtube}
                      onClick={(e) => handlePodcastLinkClick(e, episode.podcastUrls!.youtube!)}
                      className="flex items-center text-sm text-primary relative z-10"
                    >
                      <Youtube className="h-4 w-4 mr-1.5" />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              )}
              
              <p className="text-sm text-muted-foreground line-clamp-2">{episode.introduction}</p>
            </div>
            
            {episode.coverArt ? (
              <div className="h-24 w-24 rounded-md overflow-hidden shrink-0 hidden sm:block">
                <AspectRatio ratio={1/1} className="h-full">
                  <img 
                    src={episode.coverArt} 
                    alt={`Cover for ${episode.title}`}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0 hidden sm:block">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
