
import { Link } from 'react-router-dom';
import { ChevronRight, Twitter, Linkedin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Guest } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface GuestCardProps {
  guest: Guest;
  className?: string;
}

export function GuestCard({ guest, className }: GuestCardProps) {
  // Get initials from name
  const initials = guest.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  return (
    <Card className={cn(
      "overflow-hidden hover-scale cursor-pointer group",
      className
    )}>
      <Link to={`/guests/${guest.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border">
              <AvatarImage src={guest.imageUrl} alt={guest.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg truncate">{guest.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{guest.title}</p>
              
              <div className="flex flex-wrap gap-2">
                {guest.socialLinks.twitter && (
                  <a 
                    href={guest.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-xs p-1.5 rounded-md bg-muted hover:bg-accent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Twitter className="h-3.5 w-3.5 mr-1.5" />
                    <span>Twitter</span>
                  </a>
                )}
                
                {guest.socialLinks.linkedin && (
                  <a 
                    href={guest.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-xs p-1.5 rounded-md bg-muted hover:bg-accent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin className="h-3.5 w-3.5 mr-1.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                
                {guest.socialLinks.website && (
                  <a 
                    href={guest.socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-xs p-1.5 rounded-md bg-muted hover:bg-accent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="h-3.5 w-3.5 mr-1.5" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
            
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
