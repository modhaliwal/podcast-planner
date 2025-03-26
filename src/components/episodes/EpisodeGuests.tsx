
import { Guest } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { GuestChip } from '@/components/guests/GuestChip';

interface EpisodeGuestsProps {
  guests?: Guest[];
  guestIds?: string[];
}

export function EpisodeGuests({ guests: propGuests, guestIds }: EpisodeGuestsProps) {
  const { guests: contextGuests } = useAuth();
  
  let guests: Guest[] = [];
  
  if (propGuests) {
    guests = propGuests;
  } else if (guestIds && guestIds.length > 0) {
    guests = contextGuests.filter(guest => guestIds.includes(guest.id));
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
