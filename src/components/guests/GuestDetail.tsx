
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Guest, Episode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuestProfileCard } from './GuestProfileCard';
import { GuestAboutSection } from './GuestAboutSection';
import { GuestEpisodesList } from './GuestEpisodesList';

interface GuestDetailProps {
  guest: Guest;
  episodes: Episode[];
  className?: string;
}

export function GuestDetail({ guest, episodes, className }: GuestDetailProps) {
  const [activeTab, setActiveTab] = useState("info");
  
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to="/guests">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <GuestProfileCard guest={guest} />
        </div>
        
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
              <TabsTrigger value="episodes" className="flex-1">Episodes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="animate-fade-in">
              <GuestAboutSection guest={guest} />
            </TabsContent>
            
            <TabsContent value="episodes" className="animate-fade-in">
              <GuestEpisodesList guest={guest} episodes={episodes} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
