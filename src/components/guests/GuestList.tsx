
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Guest } from "@/lib/types";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Twitter, Linkedin, Globe, Instagram, Youtube } from "lucide-react";

interface GuestListProps {
  guests: Guest[];
}

export function GuestList({ guests }: GuestListProps) {
  return (
    <div className="container px-0 py-2">
      <Table>
        <TableCaption>A list of your podcast guests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Social</TableHead>
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
              <TableRow key={guest.id} className="cursor-pointer hover:bg-muted/60">
                <TableCell className="w-[60px]">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={guest.imageUrl} alt={guest.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <Link to={`/guests/${guest.id}`} className="hover:underline">
                    {guest.name}
                  </Link>
                </TableCell>
                <TableCell>{guest.title}</TableCell>
                <TableCell>{guest.company}</TableCell>
                <TableCell>
                  {guest.status ? <Badge>{guest.status}</Badge> : null}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {guest.socialLinks.twitter && (
                      <a 
                        href={guest.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    
                    {guest.socialLinks.linkedin && (
                      <a 
                        href={guest.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    
                    {guest.socialLinks.instagram && (
                      <a 
                        href={guest.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    
                    {guest.socialLinks.youtube && (
                      <a 
                        href={guest.socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Youtube className="h-4 w-4" />
                      </a>
                    )}
                    
                    {guest.socialLinks.website && (
                      <a 
                        href={guest.socialLinks.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              {guests.length} Guest(s)
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
