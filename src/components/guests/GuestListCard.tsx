
import { Guest, Episode } from "@/lib/types";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Twitter, Linkedin, Globe, Instagram, Youtube } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GuestEpisodeMiniCard } from "./GuestEpisodeMiniCard";
import { guestStatusColors } from "@/lib/statusColors";
import { GuestSocialLinks } from "./GuestListSocialLinks";
import { GuestInfo } from "./GuestListInfo";

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
          {/* Avatar section */}
          <Avatar className="h-16 w-16 shrink-0 border">
            <AvatarImage src={guest.imageUrl} alt={guest.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          
          {/* Guest info section */}
          <GuestInfo guest={guest} statusColor={statusColor} />
          
          {/* Social links section */}
          <GuestSocialLinks socialLinks={guest.socialLinks} />
          
          {/* Flexible spacer */}
          <div className="hidden md:block flex-1"></div>
          
          {/* Latest episode info - visible at larger breakpoints */}
          <div className="hidden lg:block w-1/3 shrink-0">
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
}
