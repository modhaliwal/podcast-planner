
import React from 'react';
import { Button } from '@/components/ui/button';
import { Guest } from '@/lib/types';
import { GuestChip } from '@/components/guests/GuestChip';

interface GuestMiniCardProps {
  guest: Guest;
  onRemove: (guestId: string) => void;
}

export function GuestMiniCard({ guest, onRemove }: GuestMiniCardProps) {
  return (
    <div className="flex items-start bg-card border rounded-md group relative">
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
        onClick={() => onRemove(guest.id)}
      >
        ×
      </Button>
    </div>
  );
}
