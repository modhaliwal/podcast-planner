
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, Guest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EpisodeStatusHeader } from './EpisodeStatusHeader';
import { EpisodeGuests } from './EpisodeGuests';
import { EpisodeRecordingLinks } from './EpisodeRecordingLinks';
import { EpisodeInfoTab } from './EpisodeInfoTab';
import { EpisodeTopicsTab } from './EpisodeTopicsTab';
import { EpisodeNotesTab } from './EpisodeNotesTab';

interface EpisodeDetailProps {
  episode: Episode;
  guests: Guest[];
  className?: string;
}

export function EpisodeDetail({ episode, guests, className }: EpisodeDetailProps) {
  const [activeTab, setActiveTab] = useState("info");
  
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="info" className="flex-1">Episode Info</TabsTrigger>
            <TabsTrigger value="topics" className="flex-1">Topics</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="animate-fade-in">
            <EpisodeInfoTab episode={episode} />
          </TabsContent>
          
          <TabsContent value="topics" className="animate-fade-in">
            <EpisodeTopicsTab episode={episode} />
          </TabsContent>
          
          <TabsContent value="notes" className="animate-fade-in">
            <EpisodeNotesTab episode={episode} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
