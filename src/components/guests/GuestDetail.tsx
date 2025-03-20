
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft, ExternalLink, FileText, Globe, Instagram, Linkedin, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Guest, Episode } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface GuestDetailProps {
  guest: Guest;
  episodes: Episode[];
  className?: string;
}

export function GuestDetail({ guest, episodes, className }: GuestDetailProps) {
  const [activeTab, setActiveTab] = useState("info");
  
  // Get initials from name
  const initials = guest.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  // Filter episodes that include this guest
  const guestEpisodes = episodes.filter(
    episode => episode.guestIds.includes(guest.id)
  );
  
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
          <Card className="sticky top-28 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border mb-4">
                  <AvatarImage src={guest.imageUrl} alt={guest.name} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-semibold">{guest.name}</h2>
                <p className="text-muted-foreground mb-4">{guest.title}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {guest.socialLinks.twitter && (
                    <a 
                      href={guest.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  
                  {guest.socialLinks.linkedin && (
                    <a 
                      href={guest.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  
                  {guest.socialLinks.instagram && (
                    <a 
                      href={guest.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  
                  {guest.socialLinks.youtube && (
                    <a 
                      href={guest.socialLinks.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                  )}
                  
                  {guest.socialLinks.website && (
                    <a 
                      href={guest.socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
                      aria-label="Website"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                {guest.email && (
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${guest.email}`} className="hover:underline">{guest.email}</a>
                  </div>
                )}
                
                {guest.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${guest.phone}`} className="hover:underline">{guest.phone}</a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Personal Notes section with rich text display */}
          {guest.notes && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Personal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: guest.notes }}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
              <TabsTrigger value="episodes" className="flex-1">Episodes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{guest.bio}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Background Research section with rich text display */}
              {guest.backgroundResearch && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Background Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: guest.backgroundResearch }}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="episodes" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Episodes with {guest.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {guestEpisodes.length > 0 ? (
                    <div className="space-y-4">
                      {guestEpisodes.map((episode) => (
                        <div key={episode.id} className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center",
                            episode.status === 'published' ? "bg-green-100 text-green-700" :
                            episode.status === 'recorded' ? "bg-blue-100 text-blue-700" :
                            "bg-orange-100 text-orange-700"
                          )}>
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{episode.title}</h4>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <span className="capitalize">{episode.status}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(episode.scheduled).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm line-clamp-2">{episode.introduction}</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/episodes/${episode.id}`}>
                              <FileText className="h-4 w-4 mr-1" />
                              Details
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No episodes with this guest yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
