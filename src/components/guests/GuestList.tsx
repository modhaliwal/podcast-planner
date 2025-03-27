
import { Badge } from "@/components/ui/badge";
import { Guest, Episode } from "@/lib/types";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Twitter, Linkedin, Globe, Instagram, Youtube, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

interface GuestListProps {
  guests: Guest[];
}

export function GuestList({ guests }: GuestListProps) {
  const { episodes } = useAuth();

  return (
    <div className="space-y-4">
      {guests.map((guest) => {
        // Get initials from name
        const initials = guest.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();
        
        // Find episodes this guest is part of
        const guestEpisodes = episodes.filter(
          episode => episode.guestIds.includes(guest.id)
        );
        
        // Sort episodes to get the most recent one first
        const sortedEpisodes = [...guestEpisodes].sort((a, b) => {
          return new Date(b.scheduled).getTime() - new Date(a.scheduled).getTime();
        });
        
        // Get the most recent episode if available
        const latestEpisode = sortedEpisodes.length > 0 ? sortedEpisodes[0] : null;

        return (
          <Link to={`/guests/${guest.id}`} key={guest.id}>
            <Card className="p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-start gap-4">
                {/* Avatar section */}
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={guest.imageUrl} alt={guest.name} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                
                {/* Main content section */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium truncate">{guest.name}</h3>
                      <p className="text-muted-foreground">
                        {guest.title}
                        {guest.company && <span>, {guest.company}</span>}
                      </p>
                      
                      {/* Social links - Moved here to be closer to the middle */}
                      <div className="flex mt-2 space-x-3">
                        {guest.socialLinks.twitter && (
                          <a 
                            href={guest.socialLinks.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                        )}
                        
                        {guest.socialLinks.linkedin && (
                          <a 
                            href={guest.socialLinks.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        
                        {guest.socialLinks.instagram && (
                          <a 
                            href={guest.socialLinks.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        
                        {guest.socialLinks.youtube && (
                          <a 
                            href={guest.socialLinks.youtube} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Youtube className="h-4 w-4" />
                          </a>
                        )}
                        
                        {guest.socialLinks.website && (
                          <a 
                            href={guest.socialLinks.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Status badge */}
                    {guest.status && (
                      <Badge className="ml-auto">{guest.status}</Badge>
                    )}
                  </div>
                </div>
                
                {/* Latest episode info */}
                {latestEpisode && (
                  <div className="hidden sm:block border-l pl-4 min-w-[200px]">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Latest Episode</span>
                    </div>
                    <p className="font-medium text-sm truncate">{latestEpisode.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(latestEpisode.scheduled), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        );
      })}
      <div className="text-center text-sm text-muted-foreground py-2">
        {guests.length} Guest(s)
      </div>
    </div>
  );
}
