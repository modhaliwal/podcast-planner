
import { Link } from 'react-router-dom';
import { ChevronRight, Twitter, Linkedin, Globe } from 'lucide-react';
import { Guest } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface GuestListProps {
  guests: Guest[];
}

export function GuestList({ guests }: GuestListProps) {
  // Function to render status badge
  const renderStatusBadge = (status?: string) => {
    const statusMap = {
      potential: { label: 'Potential', variant: 'outline' as const },
      contacted: { label: 'Contacted', variant: 'secondary' as const },
      confirmed: { label: 'Confirmed', variant: 'default' as const },
      appeared: { label: 'Appeared', variant: 'success' as const },
    };
    
    const statusInfo = status ? statusMap[status as keyof typeof statusMap] : statusMap.potential;
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Guest</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Socials</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => {
            // Get initials from name
            const initials = guest.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase();
            
            return (
              <TableRow key={guest.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={guest.imageUrl} alt={guest.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{guest.name}</div>
                      <div className="text-sm text-muted-foreground">{guest.title}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {renderStatusBadge(guest.status)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
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
                </TableCell>
                <TableCell className="text-right">
                  <Link 
                    to={`/guests/${guest.id}`}
                    className="inline-flex items-center text-sm font-medium text-primary"
                  >
                    View
                    <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
