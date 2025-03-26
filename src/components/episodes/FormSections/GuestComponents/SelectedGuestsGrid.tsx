
import React from 'react';
import { Guest } from '@/lib/types';
import { GuestMiniCard } from './GuestMiniCard';

interface SelectedGuestsGridProps {
  selectedGuestIds: string[];
  availableGuests: Guest[];
  onRemoveGuest: (guestId: string) => void;
}

export function SelectedGuestsGrid({ selectedGuestIds, availableGuests, onRemoveGuest }: SelectedGuestsGridProps) {
  if (!selectedGuestIds || selectedGuestIds.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-medium">Selected Guests:</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
        {selectedGuestIds.map((guestId) => {
          const guest = availableGuests.find(g => g.id === guestId);
          if (!guest) return null;
          
          return (
            <GuestMiniCard 
              key={guestId} 
              guest={guest} 
              onRemove={onRemoveGuest} 
            />
          );
        })}
      </div>
    </div>
  );
}
