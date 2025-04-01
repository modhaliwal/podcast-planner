
import React, { memo } from 'react';
import { Guest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { GuestChip } from '@/components/guests/GuestChip';

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
  // Early return if there are no selected guests
  if (!selectedGuestIds || selectedGuestIds.length === 0) {
    return null;
  }
  
  // Filter available guests to only include those that are selected
  const validGuests = selectedGuestIds
    .map(guestId => availableGuests.find(g => g.id === guestId))
    .filter((guest): guest is Guest => guest !== undefined);

  // Early return if no valid guests were found (prevents rendering empty grid)
  if (validGuests.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-medium">Selected Guests:</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
        {validGuests.map((guest) => (
          // GuestMiniCard (inlined)
          <div key={guest.id} className="flex items-start bg-card border rounded-md group relative">
            <GuestChip 
              guest={guest} 
              size="lg" 
              showLink={false} 
              className="flex-1 min-w-0 bg-transparent hover:bg-transparent"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 absolute top-1 right-1"
              onClick={() => onRemoveGuest(guest.id)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
});
