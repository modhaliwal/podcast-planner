
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
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GuestListProps {
  guests: Guest[];
  onDelete: (guestId: string) => void;
}

export function GuestList({ guests, onDelete }: GuestListProps) {
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null);

  const handleDeleteClick = (guestId: string) => {
    setGuestToDelete(guestId);
  };

  const confirmDelete = () => {
    if (guestToDelete) {
      onDelete(guestToDelete);
      setGuestToDelete(null);
    }
  };

  const cancelDelete = () => {
    setGuestToDelete(null);
  };

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableCaption>A list of your podcast guests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell className="font-medium">{guest.name}</TableCell>
              <TableCell>{guest.title}</TableCell>
              <TableCell>{guest.company}</TableCell>
              <TableCell>
                {guest.status ? <Badge>{guest.status}</Badge> : null}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/guests/${guest.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteClick(guest.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              {guests.length} Guest(s)
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <AlertDialog open={!!guestToDelete} onOpenChange={() => setGuestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the guest and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
