
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/toast';
import { supabase } from '@/integrations/supabase/client';
import { Guest } from '@/lib/types';
import { deleteImage, isBlobUrl } from '@/lib/imageUpload';
import { useAuth } from '@/contexts/AuthContext';

export function useGuestActions() {
  const navigate = useNavigate();
  const { refreshGuests } = useAuth();
  
  const handleSave = async (guestId: string, updatedGuest: Guest, currentGuest?: Guest) => {
    try {
      console.log("Saving guest with image:", updatedGuest.imageUrl);
      
      // Handle image URL - if null is passed, it means remove the image
      let imageUrl = updatedGuest.imageUrl === null ? null : updatedGuest.imageUrl;
      
      // If there's an existing image and we're removing it, delete it from storage
      if (currentGuest?.imageUrl && imageUrl === null) {
        await deleteImage(currentGuest.imageUrl);
        console.log("Deleted previous image from storage");
      }
      
      // Don't save blob URLs to the database
      if (imageUrl && isBlobUrl(imageUrl)) {
        imageUrl = undefined;
      }
      
      console.log("Final image URL to save to database:", imageUrl);
      
      // Stringify versions for database storage
      const bioVersionsString = updatedGuest.bioVersions ? 
        JSON.stringify(updatedGuest.bioVersions) : null;
      
      const backgroundResearchVersionsString = updatedGuest.backgroundResearchVersions ? 
        JSON.stringify(updatedGuest.backgroundResearchVersions) : null;
      
      const { error } = await supabase
        .from('guests')
        .update({
          name: updatedGuest.name,
          title: updatedGuest.title,
          company: updatedGuest.company,
          email: updatedGuest.email,
          phone: updatedGuest.phone,
          bio: updatedGuest.bio,
          bio_versions: bioVersionsString,
          background_research: updatedGuest.backgroundResearch,
          background_research_versions: backgroundResearchVersionsString,
          image_url: imageUrl,
          social_links: updatedGuest.socialLinks as any,
          notes: updatedGuest.notes,
          status: updatedGuest.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', guestId);
      
      if (error) throw error;
      
      // Update guest with the correct imageUrl value
      const savedGuest = {
        ...updatedGuest,
        imageUrl: imageUrl === null ? undefined : imageUrl,
      };
      
      // Refresh the guests list
      await refreshGuests();
      
      toast({
        title: "Success",
        description: "Guest updated successfully"
      });
      
      return { success: true, guest: savedGuest };
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

  const handleDelete = async (guestId: string | undefined, guestImageUrl?: string) => {
    try {
      if (!guestId) {
        throw new Error("Guest ID is required");
      }
      
      // If the guest has an image, delete it from storage
      if (guestImageUrl) {
        await deleteImage(guestImageUrl);
      }
      
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Guest deleted successfully"
      });
      
      await refreshGuests();
      
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
    }
  };

  return {
    handleSave,
    handleDelete
  };
}
