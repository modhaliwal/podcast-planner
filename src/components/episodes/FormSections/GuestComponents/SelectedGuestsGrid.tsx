
import React, { memo } from 'react';
import { Guest } from '@/lib/types';
import { GuestMiniCard } from './GuestMiniCard';

interface SelectedGuestsGridProps {
  selectedGuestIds: string[];
  availableGuests: Guest[];
  onRemoveGuest: (guestId: string) => void;
}

export const SelectedGuestsGrid = memo(function SelectedGuestsGrid({ 
  selectedGuestIds, 
  availableGuests, 
  onRemoveGuest 
}: SelectedGuestsGridProps) {
  if (!selectedGuestIds || selectedGuestIds.length === 0) {
    return null;
  }
  
  const validGuests = selectedGuestIds
    .map(guestId => availableGuests.find(g => g.id === guestId))
    .filter((guest): guest is Guest => guest !== undefined);

  if (validGuests.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-medium">Selected Guests:</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
        {validGuests.map((guest) => (
          <GuestMiniCard 
            key={guest.id} 
            guest={guest} 
            onRemove={onRemoveGuest} 
          />
        ))}
      </div>
    </div>
  );
});
