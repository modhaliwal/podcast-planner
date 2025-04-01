
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Guest } from '@/lib/types';

interface GuestViewHeaderProps {
  guest: Guest;
  onDeleteClick: () => void;
}

export function GuestViewHeader({ 
  guest, 
  onDeleteClick 
}: GuestViewHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          asChild
        >
          <Link to={`/guests/${guest.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:text-destructive"
          onClick={onDeleteClick}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
