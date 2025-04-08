
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { Button } from '@/components/ui/button';
import { useGuestData } from '@/hooks/guests/useGuestData';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { guest, isLoading, error, handleDelete } = useGuestData(id);
  const { episodes } = useAuth();
  
  const guestEpisodes = episodes.filter(episode => 
    guest?.id && episode.guestIds.includes(guest.id)
  );
  
  // Create delete button as React node to pass to GuestDetail
  const deleteButton = (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Guest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this guest? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  if (isLoading) {
    return <Shell>
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="text-center py-12">Loading guest...</div>
      </div>
    </Shell>;
  }
  
  if (error || !guest) {
    return <Shell>
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-semibold mb-2">Guest not found</h1>
          <p className="text-muted-foreground mb-6">The guest you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/guests">Back to Guests</Link>
          </Button>
        </div>
      </div>
    </Shell>;
  }
  
  return (
    <Shell>
      <GuestDetail
        guest={guest}
        episodes={guestEpisodes}
        onDelete={deleteButton}
      />
    </Shell>
  );
};

export default GuestView;
