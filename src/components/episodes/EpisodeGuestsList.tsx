
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Guest } from '@/lib/types';
import { GuestChip } from '@/components/guests/GuestChip';

interface EpisodeGuestsListProps {
  guests: Guest[];
}

export function EpisodeGuestsList({ guests }: EpisodeGuestsListProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Guests</h3>
      <div className="flex flex-wrap items-center gap-2">
        {guests.length > 0 ? (
          <>
            {guests.map((guest) => (
              <GuestChip 
                key={guest.id} 
                guest={guest} 
                size="sm"
              />
            ))}
            
            {guests.length > 5 && (
              <Badge variant="outline">
                +{guests.length - 5} more
              </Badge>
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">No guests assigned</span>
        )}
      </div>
    </div>
  );
}
