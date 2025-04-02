
import { useParams, Navigate } from 'react-router-dom';
import { useGuestData } from '@/hooks/guests/useGuestData';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import { GuestNotFound } from '@/components/guests/GuestNotFound';

export default function GuestView() {
  const { id } = useParams<{ id: string }>();
  
  const { 
    isLoading, 
    guest, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    handleDelete 
  } = useGuestData(id);

  if (isLoading) {
    return (
      <Shell>
        <div className="container max-w-5xl py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-2" />
            <div className="h-4 w-48 bg-muted rounded mb-8" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </Shell>
    );
  }

  if (!guest) {
    return (
      <Shell>
        <GuestNotFound />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container max-w-5xl py-8">
        <GuestDetail 
          guest={guest} 
          onDelete={() => setIsDeleteDialogOpen(true)} 
        />
        
        <DeleteGuestDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleDelete}
          guestName={guest?.name}
        />
      </div>
    </Shell>
  );
}
