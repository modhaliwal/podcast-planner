
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Guest } from '@/lib/types';

interface GuestMiniCardProps {
  guest: Guest;
  onRemove: (guestId: string) => void;
}

export function GuestMiniCard({ guest, onRemove }: GuestMiniCardProps) {
  // Helper function to get guest initials
  const getGuestInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-start p-3 bg-card border rounded-md group relative">
      <Avatar className="h-10 w-10 mr-3 border">
        <AvatarImage src={guest.imageUrl} alt={guest.name} />
        <AvatarFallback>{getGuestInitials(guest.name)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{guest.name}</h4>
        <p className="text-xs text-muted-foreground truncate">{guest.title}</p>
        {guest.company && (
          <p className="text-xs text-muted-foreground truncate">{guest.company}</p>
        )}
      </div>
      
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
