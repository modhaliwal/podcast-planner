
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft, FileAudio, FileText, Film, Headphones, Link2, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Episode, Guest, Topic } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  
  // Format the scheduled date
  const formattedDate = new Date(episode.scheduled).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format the scheduled time
  const formattedTime = new Date(episode.scheduled).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
  
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
            <div className="flex flex-col md:flex-row gap-6">
              <div className={cn(
                "h-16 w-16 rounded-xl flex items-center justify-center shrink-0",
                episode.status === 'published' ? "bg-green-100 text-green-700" :
                episode.status === 'recorded' ? "bg-blue-100 text-blue-700" :
                "bg-orange-100 text-orange-700"
              )}>
                <Calendar className="h-8 w-8" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant={
                    episode.status === 'published' ? "default" :
                    episode.status === 'recorded' ? "secondary" :
                    "outline"
                  }>
                    {episode.status}
                  </Badge>
                  
                  <span className="text-sm text-muted-foreground">
                    {formattedDate} at {formattedTime}
                  </span>
                </div>
                
                <h1 className="text-2xl font-semibold mb-4">{episode.title}</h1>
                
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">Guests</h2>
                    <div className="flex flex-wrap gap-2">
                      {episodeGuests.length > 0 ? (
                        episodeGuests.map(guest => (
                          <Link 
                            key={guest.id} 
                            to={`/guests/${guest.id}`}
                            className="flex items-center p-2 bg-muted rounded-lg hover:bg-accent transition-colors"
                          >
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={guest.imageUrl} alt={guest.name} />
                              <AvatarFallback className="text-xs">
                                {guest.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{guest.name}</span>
                          </Link>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No guests assigned</span>
                      )}
                    </div>
                  </div>
                  
                  {(episode.status === 'recorded' || episode.status === 'published') && episode.recordingLinks && (
                    <div>
                      <h2 className="text-sm font-medium text-muted-foreground mb-2">Recordings</h2>
                      <div className="flex flex-wrap gap-2">
                        {episode.recordingLinks.audio && (
                          <a 
                            href={episode.recordingLinks.audio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                          >
                            <Headphones className="h-4 w-4 mr-2" />
                            <span className="text-sm">Audio</span>
                          </a>
                        )}
                        
                        {episode.recordingLinks.video && (
                          <a 
                            href={episode.recordingLinks.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                          >
                            <Film className="h-4 w-4 mr-2" />
                            <span className="text-sm">Video</span>
                          </a>
                        )}
                        
                        {episode.recordingLinks.transcript && (
                          <a 
                            href={episode.recordingLinks.transcript}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="text-sm">Transcript</span>
                          </a>
                        )}
                        
                        {episode.recordingLinks.other && episode.recordingLinks.other.map((link, index) => (
                          <a 
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                          >
                            <Link2 className="h-4 w-4 mr-2" />
                            <span className="text-sm">{link.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
            <Card>
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{episode.introduction}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="topics" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Topics</CardTitle>
              </CardHeader>
              <CardContent>
                {episode.topics.length > 0 ? (
                  <div className="space-y-6">
                    {episode.topics.map((topic, index) => (
                      <div key={topic.id}>
                        {index > 0 && <Separator className="my-6" />}
                        <div>
                          <h3 className="text-lg font-medium mb-2">{topic.title}</h3>
                          <p className="text-muted-foreground whitespace-pre-line">{topic.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No topics added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Episode Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{episode.notes || "No notes added yet"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
