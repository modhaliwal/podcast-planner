
import { Guest } from '@/lib/types';
import { useAuthProxy } from '@/hooks/useAuthProxy';
import { GuestChip } from '@/components/guests/GuestChip';

interface EpisodeGuestsProps {
  guests?: Guest[];
  guestIds?: string[];
}

export function EpisodeGuests({ guests: propGuests, guestIds }: EpisodeGuestsProps) {
  // Since we're moving away from AuthContext, we would need to fetch this data differently
  // For now, just use the provided guests prop
  
  let guests: Guest[] = [];
  
  if (propGuests) {
    guests = propGuests;
  } else if (guestIds && guestIds.length > 0) {
    // In the future, implement a proper fetch here
    // For now, we'll just use what's provided
    guests = [];
  }
  
  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground mb-2">Guests</h2>
      <div className="flex flex-wrap gap-2">
        {guests.length > 0 ? (
          guests.map(guest => (
            <GuestChip 
              key={guest.id} 
              guest={guest} 
              size="sm"
            />
          ))
        ) : (
          <span className="text-sm text-muted-foreground">No guests assigned</span>
        )}
      </div>
    </div>
  );
}
