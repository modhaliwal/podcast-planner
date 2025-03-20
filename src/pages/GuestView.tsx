
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { guests, episodes } from '@/lib/data';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { GuestForm } from '@/components/guests/GuestForm';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [localGuests, setLocalGuests] = useState(guests);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Find the guest with the matching ID
  const guestIndex = localGuests.findIndex(g => g.id === id);
  const guest = guestIndex !== -1 ? localGuests[guestIndex] : undefined;
  
  if (!guest) {
    return (
      <Shell>
        <div className="page-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-semibold mb-2">Guest not found</h1>
            <p className="text-muted-foreground mb-6">The guest you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/guests">Back to Guests</a>
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  const handleSave = (updatedGuest: any) => {
    // In a real app, this would make an API call
    // For now, we'll just update our local state
    const updatedGuests = [...localGuests];
    updatedGuests[guestIndex] = updatedGuest;
    
    setLocalGuests(updatedGuests);
    setIsEditing(false);
    toast.success("Guest updated successfully");
  };

  const handleDelete = () => {
    // In a real app, this would make an API call
    // For now, we'll just update our local state
    const updatedGuests = localGuests.filter(g => g.id !== id);
    setLocalGuests(updatedGuests);
    setIsDeleteDialogOpen(false);
    
    // Show success message
    toast.success("Guest deleted successfully");
    
    // Redirect to guests list
    window.location.href = '/guests';
  };
  
  return (
    <Shell>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="section-title">{guest.name}</h1>
            <p className="section-subtitle">{guest.title}</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel Edit" : "Edit"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        {isEditing ? (
          <GuestForm 
            guest={guest} 
            onSave={handleSave} 
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <GuestDetail guest={guest} episodes={episodes} />
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Guest</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {guest.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  );
};

export default GuestView;
