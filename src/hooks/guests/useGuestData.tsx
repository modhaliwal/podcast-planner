
import { useState } from 'react';
import { useFetchGuest } from './useFetchGuest';
import { useGuestActions } from './useGuestActions';
import { Guest } from '@/lib/types';

export function useGuestData(guestId: string | undefined) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { isLoading, guest, setGuest, fetchGuest } = useFetchGuest(guestId);
  const { handleSave: saveGuest, handleDelete: deleteGuest } = useGuestActions();
  
  const handleSave = async (updatedGuest: Guest) => {
    if (!guestId) return { success: false };
    
    const result = await saveGuest(guestId, updatedGuest, guest);
    
    if (result.success) {
      setGuest(result.guest);
      
      // Refetch to ensure we have the latest data
      await fetchGuest();
    }
    
    return result;
  };

  const handleDelete = async () => {
    const result = await deleteGuest(guestId, guest?.imageUrl);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
    }
    
    return result;
  };

  return {
    isLoading,
    guest,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleSave,
    handleDelete
  };
}
