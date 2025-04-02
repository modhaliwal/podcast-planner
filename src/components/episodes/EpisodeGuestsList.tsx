
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Guest } from '@/lib/types';
import { GuestChip } from '@/components/guests/GuestChip';

interface EpisodeGuestsListProps {
  guests: Guest[];
}

export function EpisodeGuestsList({ guests }: EpisodeGuestsListProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
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
        <span className="text-sm text-muted-foreground">No guests</span>
      )}
    </div>
  );
}
