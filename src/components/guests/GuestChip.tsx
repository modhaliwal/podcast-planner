
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Guest } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GuestChipProps {
  guest: Guest;
  size?: 'sm' | 'md' | 'lg';
  showLink?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function GuestChip({ 
  guest, 
  size = 'md', 
  showLink = true, 
  className,
  onClick
}: GuestChipProps) {
  // Helper function to get guest initials
  const getGuestInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const avatarSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const chipSizes = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base'
  };

  const ChipContent = () => (
    <div className={cn(
      "flex items-center bg-muted rounded-lg hover:bg-accent transition-colors", 
      chipSizes[size],
      className
    )}>
      <Avatar className={cn("mr-2", avatarSizes[size])}>
        <AvatarImage src={guest.imageUrl} alt={guest.name} />
        <AvatarFallback className="text-xs">
          {getGuestInitials(guest.name)}
        </AvatarFallback>
      </Avatar>
      <span>{guest.name}</span>
    </div>
  );

  if (showLink && !onClick) {
    return (
      <Link to={`/guests/${guest.id}`}>
        <ChipContent />
      </Link>
    );
  }

  if (onClick) {
    return (
      <button 
        type="button" 
        className="text-left w-auto" 
        onClick={onClick}
      >
        <ChipContent />
      </button>
    );
  }

  return <ChipContent />;
}
