
import { Link } from 'react-router-dom';
import { ChevronLeft, Info, BookText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, Guest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EpisodeStatusHeader } from './EpisodeStatusHeader';
import { EpisodeGuests } from './EpisodeGuests';
import { EpisodeRecordingLinks } from './EpisodeRecordingLinks';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EpisodeDetailProps {
  episode: Episode;
  guests: Guest[];
  className?: string;
}

export function EpisodeDetail({ episode, guests, className }: EpisodeDetailProps) {
  // Get the guests for this episode
  const episodeGuests = guests.filter(guest => 
    episode.guestIds.includes(guest.id)
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
            <EpisodeStatusHeader episode={episode} />
            
            <div className="mt-6 space-y-4">
              <EpisodeGuests guests={episodeGuests} />
              
              <EpisodeRecordingLinks episode={episode} />
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
            
            <div className="prose dark:prose-invert max-w-none">
              {episode.introduction ? (
                <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">{episode.introduction}</p>
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
              <div className="prose dark:prose-invert max-w-none">
                {episode.notes ? (
                  <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: episode.notes }} />
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">No notes added yet</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
