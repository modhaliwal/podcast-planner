
import { Mail, Phone, Briefcase, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Guest } from '@/lib/types';

interface GuestBasicInfoCardProps {
  guest: Guest;
}

export function GuestBasicInfoCard({ guest }: GuestBasicInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">Basic Information</h3>
        
        <div className="space-y-3">
          {guest.title && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span>{guest.title}</span>
            </div>
          )}
          
          {guest.company && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{guest.company}</span>
            </div>
          )}
          
          {guest.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${guest.email}`} className="hover:underline">{guest.email}</a>
            </div>
          )}
          
          {guest.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${guest.phone}`} className="hover:underline">{guest.phone}</a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
