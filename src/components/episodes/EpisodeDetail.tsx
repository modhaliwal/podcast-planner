
import { Link } from 'react-router-dom';
import { ChevronLeft, Info, BookText, Image, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, Guest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EpisodeStatusHeader } from './EpisodeStatusHeader';
import { EpisodeGuestsList } from './EpisodeGuestsList';
import { EpisodeRecordingLinks } from './EpisodeRecordingLinks';
import { EpisodePodcastUrls } from './EpisodePodcastUrls';
import { EpisodeResources } from './EpisodeResources';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useMemo } from 'react';

interface EpisodeDetailProps {
  episode: Episode;
  guests: Guest[];
  className?: string;
}

export function EpisodeDetail({ episode, guests, className }: EpisodeDetailProps) {
  // Memoize episodeGuests to prevent unnecessary filtering on every render
  const episodeGuests = useMemo(() => 
    guests.filter(guest => episode.guestIds.includes(guest.id)),
    [episode.guestIds, guests]
  );
  
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to="/episodes">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Episode Details */}
              <div className="md:col-span-2 order-2 md:order-1">
                <EpisodeStatusHeader episode={episode} />
                
                <div className="mt-6 space-y-4">
                  <EpisodeGuestsList guests={episodeGuests} />
                  <EpisodeRecordingLinks episode={episode} />
                  <EpisodePodcastUrls episode={episode} />
                </div>
              </div>
              
              {/* Cover Art */}
              <div className="md:col-span-1 order-1 md:order-2">
                {episode.coverArt ? (
                  <div className="rounded-md overflow-hidden border border-border shadow-sm max-w-[240px] mx-auto md:ml-auto md:mr-0">
                    <AspectRatio ratio={1}>
                      <img 
                        src={episode.coverArt} 
                        alt={`Cover art for ${episode.title}`}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-2 bg-muted/50 border-t border-border flex justify-center">
                      <a 
                        href={episode.coverArt} 
                        download={`cover-art-episode-${episode.episodeNumber}.jpg`}
                        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-3 w-3" />
                        Download original
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md overflow-hidden border border-border shadow-sm bg-muted flex items-center justify-center max-w-[240px] mx-auto md:ml-auto md:mr-0">
                    <AspectRatio ratio={1}>
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Image className="h-12 w-12 mb-2 opacity-40" />
                        <span className="text-sm">No cover art</span>
                      </div>
                    </AspectRatio>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Introduction Section */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Info className="h-5 w-5 text-primary" />
              Introduction
            </h2>
            
            <div className="rich-text">
              {episode.introduction ? (
                <p className="whitespace-pre-line">{episode.introduction}</p>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 italic">No introduction added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Episode Notes Section */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <BookText className="h-5 w-5 text-primary" />
              Episode Notes
            </h2>
            
            <ScrollArea className="max-h-[600px]">
              <div className="rich-text">
                {episode.notes ? (
                  <div dangerouslySetInnerHTML={{ __html: episode.notes }} />
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">No notes added yet</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Resources Section */}
        {episode.resources && episode.resources.length > 0 && (
          <Card className="shadow-sm border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <EpisodeResources episode={episode} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
