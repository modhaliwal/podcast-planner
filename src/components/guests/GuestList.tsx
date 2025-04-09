
import { Guest } from "@/lib/types";
import { useAuthProxy } from "@/hooks/useAuthProxy";
import { GuestCard } from "./GuestListCard";
import { memo } from "react";

interface GuestListProps {
  guests: Guest[];
}

// Memoize the component to prevent unnecessary re-renders
export const GuestList = memo(function GuestList({ guests }: GuestListProps) {
  const { user } = useAuthProxy();
  
  // In the federated auth system, we might not have episodes directly
  // This would need to be fetched separately in a real implementation
  const episodes = []; // This would be replaced with proper data fetching

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
