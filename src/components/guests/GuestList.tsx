
import { Guest } from "@/lib/types";
import { GuestCard } from "./GuestListCard";
import { memo } from "react";
import { useData } from "@/context/DataContext";

interface GuestListProps {
  guests: Guest[];
}

// Memoize the component to prevent unnecessary re-renders
export const GuestList = memo(function GuestList({ guests }: GuestListProps) {
  // Get episodes from context to properly link guests to episodes
  const { episodes } = useData();
  
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
});
