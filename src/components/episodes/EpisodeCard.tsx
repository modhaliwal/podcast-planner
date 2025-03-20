
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, CalendarDays, Clock, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, Guest } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { EpisodeStatus } from '@/lib/enums';

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
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
              episode.status === EpisodeStatus.PUBLISHED ? "bg-green-100 text-green-700" :
              episode.status === EpisodeStatus.RECORDED ? "bg-blue-100 text-blue-700" :
              "bg-orange-100 text-orange-700"
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
              
              <div className="flex items-center -space-x-2 mb-3">
                {episodeGuests.slice(0, 3).map((guest, index) => {
                  const initials = guest.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase();
                  
                  return (
                    <Avatar key={guest.id} className="border-2 border-background h-8 w-8">
                      <AvatarImage src={guest.imageUrl} alt={guest.name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  );
                })}
                
                {episodeGuests.length > 3 && (
                  <Avatar className="border-2 border-background h-8 w-8">
                    <AvatarFallback className="text-xs">+{episodeGuests.length - 3}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className="ml-4 text-sm">
                  {episodeGuests.length > 0 ? (
                    <span>
                      {episodeGuests.length === 1 
                        ? episodeGuests[0].name 
                        : `${episodeGuests.length} guests`}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No guests</span>
                  )}
                </div>
              </div>
              
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
