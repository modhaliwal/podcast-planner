
import { Mail, Phone } from 'lucide-react';
import { Guest } from '@/lib/types';

interface GuestContactInfoProps {
  guest: Guest;
}

export function GuestContactInfo({ guest }: GuestContactInfoProps) {
  if (!guest.email && !guest.phone) return null;
  
  return (
    <div>
      {guest.email && (
        <div className="flex items-center space-x-2 text-sm mb-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${guest.email}`} className="hover:underline">{guest.email}</a>
        </div>
      )}
      
      {guest.phone && (
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${guest.phone}`} className="hover:underline">{guest.phone}</a>
        </div>
      )}
    </div>
  );
}
