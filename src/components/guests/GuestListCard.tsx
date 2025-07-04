
import { Guest, Episode } from "@/lib/types";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { guestStatusColors } from "@/lib/statusColors";
import { SocialIconsBar } from "@/components/shared/SocialIconsBar";
import { GuestInfo } from "./GuestListInfo";
import { GuestEpisodeMiniCard } from "./GuestEpisodeMiniCard";
import { cn } from "@/lib/utils";

interface GuestCardProps {
  guest: Guest;
  episodes: Episode[];
}

export function GuestCard({ guest, episodes }: GuestCardProps) {
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
  
  // Sort episodes to get the most recent ones first
  const sortedEpisodes = [...guestEpisodes].sort((a, b) => {
    return new Date(b.scheduled).getTime() - new Date(a.scheduled).getTime();
  });
  
  // Get status colors
  const statusKey = (guest.status || 'potential').toLowerCase() as keyof typeof guestStatusColors;
  const statusColor = guestStatusColors[statusKey] || guestStatusColors.potential;

  return (
    <Link to={`/guests/${guest.id}`} key={guest.id}>
      <Card className="p-4 hover:bg-muted/40 transition-colors">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex w-full sm:items-start min-w-0 relative">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {/* Avatar section */}
              <Avatar className="h-16 w-16 shrink-0 border">
                <AvatarImage src={guest.imageUrl} alt={guest.name} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              
              {/* Guest info section with social icons below */}
              <div className="flex-1 min-w-0 space-y-2">
                <GuestInfo guest={guest} statusColor={statusColor} showStatus={false} />
                <div className="max-w-full">
                  <SocialIconsBar 
                    socialLinks={guest.socialLinks} 
                    size="sm" 
                    align="start"
                  />
                </div>
              </div>
            </div>
            
            {/* Status chip in top right */}
            <div className="absolute top-0 right-0">
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
          </div>
          
          {/* Episodes info - full width on mobile, 1/3 width on desktop */}
          <div className="w-full sm:w-1/3 shrink-0">
            {sortedEpisodes.length > 0 ? (
              <div className="space-y-2">
                {sortedEpisodes.slice(0, 3).map((episode) => (
                  <GuestEpisodeMiniCard key={episode.id} episode={episode} />
                ))}
                {sortedEpisodes.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center mt-1">
                    +{sortedEpisodes.length - 3} more episodes
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
