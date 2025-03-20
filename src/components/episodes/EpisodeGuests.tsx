import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Guest } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

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
            <Link 
              key={guest.id} 
              to={`/guests/${guest.id}`}
              className="flex items-center p-2 bg-muted rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={guest.imageUrl} alt={guest.name} />
                <AvatarFallback className="text-xs">
                  {guest.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{guest.name}</span>
            </Link>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">No guests assigned</span>
        )}
      </div>
    </div>
  );
}
