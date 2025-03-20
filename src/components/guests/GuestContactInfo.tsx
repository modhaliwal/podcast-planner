
import { Mail, Phone } from 'lucide-react';

interface GuestContactInfoProps {
  email?: string;
  phone?: string;
}

export function GuestContactInfo({ email, phone }: GuestContactInfoProps) {
  if (!email && !phone) return null;
  
  return (
    <div>
      {email && (
        <div className="flex items-center space-x-2 text-sm mb-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${email}`} className="hover:underline">{email}</a>
        </div>
      )}
      
      {phone && (
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
        </div>
      )}
    </div>
  );
}
