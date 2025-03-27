
import { Guest, Episode } from "@/lib/types";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Twitter, Linkedin, Globe, Instagram, Youtube } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GuestEpisodeMiniCard } from "./GuestEpisodeMiniCard";
import { guestStatusColors } from "@/lib/statusColors";
import { useIsMobile } from "@/hooks/use-mobile";

interface GuestListProps {
  guests: Guest[];
}

export function GuestList({ guests }: GuestListProps) {
  const { episodes } = useAuth();
  const isMobile = useIsMobile();

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

        // Get status colors
        const statusKey = (guest.status || 'potential').toLowerCase() as keyof typeof guestStatusColors;
        const statusColor = guestStatusColors[statusKey] || guestStatusColors.potential;

        return (
          <Link to={`/guests/${guest.id}`} key={guest.id}>
            <Card className="p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-start gap-3 flex-wrap md:flex-nowrap">
                {/* Avatar section - fixed width */}
                <Avatar className="h-16 w-16 shrink-0 border">
                  <AvatarImage src={guest.imageUrl} alt={guest.name} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                
                {/* Guest info section - non-shrinking with fixed min-width */}
                <div className="flex-1 min-w-[180px] space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium truncate">{guest.name}</h3>
                    
                    {/* Status badge */}
                    {guest.status && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs capitalize px-2 py-0.5 shrink-0",
                          statusColor.bg,
                          statusColor.text,
                          statusColor.border,
                          statusColor.darkBg,
                          statusColor.darkText,
                          statusColor.darkBorder
                        )}
                      >
                        {guest.status}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-sm truncate">
                    {guest.title}
                    {guest.company && <span>, {guest.company}</span>}
                  </p>
                </div>
                
                {/* Social links section - flex grow and wrap with responsive sizing */}
                <div className="hidden sm:block flex-grow-0 flex-shrink-1 ml-0 min-w-0">
                  <div className="flex flex-wrap items-center gap-1">
                    {guest.socialLinks.twitter && (
                      <a 
                        href={guest.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    )}
                    
                    {guest.socialLinks.linkedin && (
                      <a 
                        href={guest.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    )}
                    
                    {guest.socialLinks.instagram && (
                      <a 
                        href={guest.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram className="h-4 w-4" />
                        <span className="sr-only">Instagram</span>
                      </a>
                    )}
                    
                    {guest.socialLinks.youtube && (
                      <a 
                        href={guest.socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Youtube className="h-4 w-4" />
                        <span className="sr-only">YouTube</span>
                      </a>
                    )}
                    
                    {guest.socialLinks.website && (
                      <a 
                        href={guest.socialLinks.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="h-4 w-4" />
                        <span className="sr-only">Website</span>
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Flexible spacer - grows to fill available space */}
                <div className="hidden md:block flex-1"></div>
                
                {/* Latest episode info - visible at sm breakpoint and up, but will collapse as needed */}
                <div className="hidden sm:block flex-shrink-1 min-w-0 md:min-w-[180px] w-auto ml-auto">
                  {latestEpisode ? (
                    <GuestEpisodeMiniCard episode={latestEpisode} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground italic">No episodes yet</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
      <div className="text-center text-sm text-muted-foreground py-2">
        {guests.length} Guest{guests.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
