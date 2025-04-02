
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Guest } from '@/lib/types';
import { GuestChip } from '@/components/guests/GuestChip';
import { useAuth } from '@/contexts/AuthContext';

interface EpisodeGuestsListProps {
  guests: Guest[];
}

export function EpisodeGuestsList({ guests }: EpisodeGuestsListProps) {
  // Logging to help debug
  useEffect(() => {
    console.log("EpisodeGuestsList rendering with guests:", guests);
  }, [guests]);

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
