
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

interface GuestListProps {
  guests: Guest[];
}

export function GuestList({ guests }: GuestListProps) {
  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableCaption>A list of your podcast guests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.length > 0 ? (
            guests.map((guest) => {
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
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <span className="text-muted-foreground">No guests match your current filters</span>
                <div className="mt-2">
                  <button className="text-primary hover:underline">Clear filters</button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              {guests.length} Guest(s)
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
