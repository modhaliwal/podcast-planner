import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useGuestData } from '@/hooks/guests/useGuestData';
import { Shell } from '@/components/layout/Shell';
import { GuestForm } from '@/components/guests/GuestForm';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import { useState } from 'react';
import { toast } from '@/hooks/toast/use-toast';
import { Guest } from '@/lib/types';
import { repositories } from '@/repositories';
import { useData } from '@/context/DataContext';

export default function EditGuest() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading, guest, error, refreshGuest } = useGuestData(id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { refreshData } = useData();

  // Add repository-based handlers
  const handleSave = async (updatedGuest: Guest) => {
    try {
      if (!id) return { success: false };

      console.log('Saving guest with background research:', {
        backgroundResearch: updatedGuest.backgroundResearch,
        versions: updatedGuest.backgroundResearchVersions,
        imageUrl: updatedGuest.imageUrl // Log the image URL to verify it's being passed
      });

      // Use repository pattern to update guest with all fields
      const result = await repositories.guests.update(id, {
        name: updatedGuest.name,
        title: updatedGuest.title,
        company: updatedGuest.company,
        email: updatedGuest.email,
        phone: updatedGuest.phone,
        bio: updatedGuest.bio,
        bioVersions: updatedGuest.bioVersions,
        backgroundResearch: updatedGuest.backgroundResearch,
        backgroundResearchVersions: updatedGuest.backgroundResearchVersions,
        socialLinks: updatedGuest.socialLinks,
        notes: updatedGuest.notes,
        status: updatedGuest.status,
        imageUrl: updatedGuest.imageUrl, // Added missing imageUrl field
      });

      if (!result) {
        throw new Error('Failed to update guest');
      }

      // Log successful save
      console.log('Guest updated successfully with image URL:', updatedGuest.imageUrl);

      // Refresh guest data
      await refreshGuest();
      // Also refresh the global data context
      await refreshData();

      toast({
        title: "Success",
        description: "Guest updated successfully"
      });

      return { success: true };
    } catch (error: any) {
      console.error("Error updating guest:", error);
      toast({
        title: "Error",
        description: `Failed to update guest: ${error.message}`,
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) return { success: false };

      // Use repository pattern to delete guest
      const success = await repositories.guests.delete(id);

      if (!success) {
        throw new Error('Failed to delete guest');
      }

      // Refresh the global data context
      await refreshData();

      toast({
        title: "Success",
        description: "Guest deleted successfully"
      });

      navigate('/guests');
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete guest: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error deleting guest:", error);
      return { success: false, error };
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return <Shell>
      <div className="container max-w-5xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </Shell>;
  }

  if (error || !guest) {
    return <Navigate to="/guests" replace />;
  }

  return (
    <Shell>
      <div className="container max-w-5xl py-8">
        <GuestForm 
          guest={guest} 
          onSave={handleSave}
          onCancel={() => navigate(-1)}
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