
import { Guest } from "@/lib/types";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { GuestCard } from "./GuestListCard";

interface GuestListProps {
  guests: Guest[];
}

export function GuestList({ guests }: GuestListProps) {
  const { episodes } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      {guests.map((guest) => (
        <GuestCard 
          key={guest.id} 
          guest={guest} 
          episodes={episodes} 
        />
      ))}
      <div className="text-center text-sm text-muted-foreground py-2">
        {guests.length} Guest{guests.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
