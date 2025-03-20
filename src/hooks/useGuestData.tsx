
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Guest, SocialLinks } from '@/lib/types';
import { isBlobUrl } from '@/lib/imageUpload';

export function useGuestData(guestId: string | undefined) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [guest, setGuest] = useState<Guest | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user, refreshGuests } = useAuth();
  
  useEffect(() => {
    const fetchGuest = async () => {
      if (!guestId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .eq('id', guestId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          console.log("Fetched guest data:", data);
          
          // Skip blob URLs as they won't be valid after page refresh
          const imageUrl = data.image_url && !isBlobUrl(data.image_url) 
            ? data.image_url 
            : undefined;
          
          // Transform the data to match our Guest interface
          const formattedGuest: Guest = {
            id: data.id,
            name: data.name,
            title: data.title,
            company: data.company || undefined,
            email: data.email || undefined,
            phone: data.phone || undefined,
            bio: data.bio,
            imageUrl: imageUrl,
            socialLinks: data.social_links as SocialLinks,
            notes: data.notes || undefined,
            backgroundResearch: data.background_research || undefined,
            status: (data.status as Guest['status']) || 'potential',
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          
          setGuest(formattedGuest);
        }
      } catch (error: any) {
        toast.error(`Failed to fetch guest: ${error.message}`);
        console.error("Error fetching guest:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGuest();
  }, [guestId]);

  const handleSave = async (updatedGuest: Guest) => {
    try {
      console.log("Saving guest with image:", updatedGuest.imageUrl);
      
      // Make sure we're not saving a blob URL
      const imageUrl = updatedGuest.imageUrl && isBlobUrl(updatedGuest.imageUrl) 
        ? undefined 
        : updatedGuest.imageUrl;
      
      const { error } = await supabase
        .from('guests')
        .update({
          name: updatedGuest.name,
          title: updatedGuest.title,
          company: updatedGuest.company,
          email: updatedGuest.email,
          phone: updatedGuest.phone,
          bio: updatedGuest.bio,
          image_url: imageUrl,
          social_links: updatedGuest.socialLinks as any,
          notes: updatedGuest.notes,
          background_research: updatedGuest.backgroundResearch,
          status: updatedGuest.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', guestId);
      
      if (error) throw error;
      
      // Make sure we're not setting a blob URL in our state
      updatedGuest.imageUrl = imageUrl;
      
      setGuest(updatedGuest);
      setIsEditing(false);
      await refreshGuests();
      toast.success("Guest updated successfully");
    } catch (error: any) {
      toast.error(`Failed to update guest: ${error.message}`);
      console.error("Error updating guest:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);
      
      if (error) throw error;
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      
      // Show success message
      toast.success("Guest deleted successfully");
      
      // Refresh guests list
      await refreshGuests();
      
      // Redirect to guests list
      navigate('/guests');
    } catch (error: any) {
      toast.error(`Failed to delete guest: ${error.message}`);
      console.error("Error deleting guest:", error);
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
