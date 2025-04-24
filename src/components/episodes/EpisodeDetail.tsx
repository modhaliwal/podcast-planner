import { Link } from 'react-router-dom';
import { ChevronLeft, Info, BookText, Image, Download, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, Guest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EpisodeStatusHeader } from './EpisodeStatusHeader';
import { EpisodeGuestsList } from './EpisodeGuestsList';
import { EpisodeRecordingLinks } from './EpisodeRecordingLinks';
import { EpisodePodcastUrls } from './EpisodePodcastUrls';
import { EpisodeResources } from './EpisodeResources';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { useMemo } from 'react';
import { Editor } from '@/components/editor/Editor';

interface EpisodeDetailProps {
  episode: Episode;
  guests: Guest[];
  className?: string;
}

export function EpisodeDetail({ episode, guests, className }: EpisodeDetailProps) {
  const episodeGuests = useMemo(() => 
    guests.filter(guest => episode.guestIds.includes(guest.id)),
    [episode.guestIds, guests]
  );
  
  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/episodes">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>

        <Button variant="outline" size="sm" asChild>
          <Link to={`/episodes/${episode.id}/edit`}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="md:col-span-2 order-2 md:order-1">
                <EpisodeStatusHeader episode={episode} />
                
                <div className="mt-3 sm:mt-4 space-y-3">
                  <EpisodeGuestsList guests={episodeGuests} />
                  <EpisodeRecordingLinks episode={episode} />
                  <EpisodePodcastUrls episode={episode} />
                </div>
              </div>
              
              <div className="md:col-span-1 order-1 md:order-2">
                {episode.coverArt ? (
                  <div className="rounded-md overflow-hidden border border-border shadow-sm max-w-[160px] sm:max-w-[200px] mx-auto md:ml-auto md:mr-0">
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
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md overflow-hidden border border-border shadow-sm bg-muted flex items-center justify-center max-w-[160px] sm:max-w-[200px] mx-auto md:ml-auto md:mr-0">
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
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              <Info className="h-4 w-4 text-primary" />
              Introduction
            </h2>
            
            <div className="space-y-4">
              {episode.introduction ? (
                <div className="rich-text">
                  <p className="whitespace-pre-line">{episode.introduction}</p>
                </div>
              ) : (
                <div className="rich-text">
                  <p className="text-slate-500 dark:text-slate-400 italic">No introduction added yet</p>
                </div>
              )}
              
              {episodeGuests.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    {episodeGuests.map((guest) => (
                      <div key={guest.id} className="space-y-2">
                        <h3 className="text-sm font-medium">About {guest.name}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {guest.bio || `No bio available for ${guest.name}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              <BookText className="h-4 w-4 text-primary" />
              Episode Notes
            </h2>
            
            <div className="rich-text">
              {episode.notes ? (
                <Editor value={episode.notes} onChange={() => {}} readOnly />
              ) : (
                <p className="text-slate-500 dark:text-slate-400 italic">No notes added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {episode.resources && episode.resources.length > 0 && (
          <Card>
            <CardContent className="p-3 sm:p-4">
              <EpisodeResources episode={episode} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
