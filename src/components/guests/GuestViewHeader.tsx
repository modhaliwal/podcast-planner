
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Guest } from '@/lib/types';

interface GuestViewHeaderProps {
  guest: Guest;
  isEditing: boolean;
  onToggleEdit: () => void;
  onDeleteClick: () => void;
}

export function GuestViewHeader({ 
  guest, 
  isEditing, 
  onToggleEdit, 
  onDeleteClick 
}: GuestViewHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="section-title">{guest.name}</h1>
        <p className="section-subtitle">{guest.title}</p>
      </div>
      
      <div className="flex space-x-2 mt-4 md:mt-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onToggleEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel Edit" : "Edit"}
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
