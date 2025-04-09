
import { useParams, Navigate } from 'react-router-dom';
import { useGuestData } from '@/hooks/guests/useGuestData';
import { Shell } from '@/components/layout/Shell';
import { GuestForm } from '@/components/guests/GuestForm';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Guest } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

export default function EditGuest() {
  const { id } = useParams<{ id: string }>();
  const { isLoading, guest, refreshGuest } = useGuestData(id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Add missing handlers
  const handleSave = async (updatedGuest: Guest) => {
    try {
      if (!id) return { success: false };
      
      // This is a mock implementation
      console.log("Saving guest", updatedGuest);
      
      // Update the guest in Supabase
      const { error } = await supabase
        .from('guests')
        .update({
          name: updatedGuest.name,
          title: updatedGuest.title,
          company: updatedGuest.company,
          email: updatedGuest.email,
          phone: updatedGuest.phone,
          bio: updatedGuest.bio,
          social_links: updatedGuest.socialLinks,
          notes: updatedGuest.notes,
          status: updatedGuest.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh guest data
      await refreshGuest();
      
      toast({
        title: "Success",
        description: "Guest updated successfully"
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update guest: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error updating guest:", error);
      return { success: false, error };
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) return { success: false };
      
      // Delete the guest from Supabase
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Guest deleted successfully"
      });
      
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
          onCancel={() => window.history.back()}
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
