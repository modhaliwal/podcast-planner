
import { useParams, Navigate } from 'react-router-dom';
import { useGuestData } from '@/hooks/guests/useGuestData';
import { Shell } from '@/components/layout/Shell';
import { GuestForm } from '@/components/guests/GuestForm';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';

export default function EditGuest() {
  const { id } = useParams<{ id: string }>();
  const { 
    isLoading, 
    guest, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    handleSave,
    handleDelete 
  } = useGuestData(id);

  if (isLoading) {
    return null;
  }

  if (!guest) {
    return <Navigate to="/guests" replace />;
  }

  return (
    <Shell>
      <div className="container max-w-5xl py-8">
        <GuestForm 
          guest={guest} 
          onSave={handleSave}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />
        <DeleteGuestDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleDelete}
          guestName={guest?.name}
        />
      </div>
    </Shell>
  );
}
