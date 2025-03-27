
import { Guest, Episode } from "@/lib/types";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { guestStatusColors } from "@/lib/statusColors";
import { GuestSocialLinks } from "./GuestListSocialLinks";
import { GuestInfo } from "./GuestListInfo";
import { GuestEpisodeMiniCard } from "./GuestEpisodeMiniCard";

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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex w-full">
            <div className="flex items-start gap-3">
              {/* Avatar section */}
              <Avatar className="h-16 w-16 shrink-0 border">
                <AvatarImage src={guest.imageUrl} alt={guest.name} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              
              {/* Guest info section */}
              <GuestInfo guest={guest} statusColor={statusColor} />
            </div>
            
            {/* Social links section - now visible in all views */}
            <div className="ml-auto">
              <GuestSocialLinks socialLinks={guest.socialLinks} />
            </div>
          </div>
          
          {/* Latest episode info - full width on mobile, 1/3 width on desktop */}
          <div className="w-full sm:w-1/3 shrink-0">
            {latestEpisode ? (
              <GuestEpisodeMiniCard episode={latestEpisode} />
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
