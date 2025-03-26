
import { useState } from 'react';
import { useFetchGuest } from './useFetchGuest';
import { useGuestActions } from './useGuestActions';
import { Guest } from '@/lib/types';

export function useGuestData(guestId: string | undefined) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { isLoading, guest, setGuest, fetchGuest } = useFetchGuest(guestId);
  const { handleSave: saveGuest, handleDelete: deleteGuest } = useGuestActions();
  
  const handleSave = async (updatedGuest: Guest) => {
    if (!guestId) return;
    
    const result = await saveGuest(guestId, updatedGuest, guest);
    
    if (result.success) {
      setGuest(result.guest);
      setIsEditing(false);
      
      // Refetch to ensure we have the latest data
      await fetchGuest();
    }
  };

  const handleDelete = async () => {
    const result = await deleteGuest(guestId, guest?.imageUrl);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    isLoading,
    guest,
    isEditing,
    isDeleteDialogOpen,
    setIsEditing,
    setIsDeleteDialogOpen,
    handleSave,
    handleDelete
  };
}
