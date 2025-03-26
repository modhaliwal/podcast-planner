
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Guest, SocialLinks, ContentVersion } from '@/lib/types';
import { isBlobUrl, deleteImage } from '@/lib/imageUpload';

export function useGuestData(guestId: string | undefined) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [guest, setGuest] = useState<Guest | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { refreshGuests } = useAuth();
  
  const fetchGuest = useCallback(async () => {
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
        console.log("Fetched guest data:", data.id);
        
        const imageUrl = data.image_url && !isBlobUrl(data.image_url) 
          ? data.image_url 
          : undefined;
        
        // Parse bioVersions and backgroundResearchVersions if they exist
        let bioVersions: ContentVersion[] = [];
        let backgroundResearchVersions: ContentVersion[] = [];
        
        try {
          if (data.bio_versions && typeof data.bio_versions === 'string') {
            bioVersions = JSON.parse(data.bio_versions);
          } else if (data.bio_versions) {
            // If it's already an object, assign directly
            bioVersions = data.bio_versions as unknown as ContentVersion[];
          }
          
          if (data.background_research_versions && typeof data.background_research_versions === 'string') {
            backgroundResearchVersions = JSON.parse(data.background_research_versions);
          } else if (data.background_research_versions) {
            // If it's already an object, assign directly
            backgroundResearchVersions = data.background_research_versions as unknown as ContentVersion[];
          }
        } catch (e) {
          console.error("Error parsing versions:", e);
        }
        
        const formattedGuest: Guest = {
          id: data.id,
          name: data.name,
          title: data.title,
          company: data.company || undefined,
          email: data.email || undefined,
          phone: data.phone || undefined,
          bio: data.bio,
          bioVersions: bioVersions,
          imageUrl: imageUrl,
          socialLinks: data.social_links as SocialLinks,
          notes: data.notes || undefined,
          backgroundResearch: data.background_research || undefined,
          backgroundResearchVersions: backgroundResearchVersions,
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
  }, [guestId]);
  
  // Initial data loading
  useEffect(() => {
    fetchGuest();
  }, [fetchGuest]);

  const handleSave = async (updatedGuest: Guest) => {
    try {
      console.log("Saving guest with image:", updatedGuest.imageUrl);
      
      // Handle image URL - if null is passed, it means remove the image
      let imageUrl = updatedGuest.imageUrl === null ? null : updatedGuest.imageUrl;
      
      // If there's an existing image and we're removing it, delete it from storage
      if (guest?.imageUrl && imageUrl === null) {
        await deleteImage(guest.imageUrl);
        console.log("Deleted previous image from storage");
      }
      
      // Don't save blob URLs to the database
      if (imageUrl && isBlobUrl(imageUrl)) {
        imageUrl = undefined;
      }
      
      console.log("Final image URL to save to database:", imageUrl);
      
      // Stringify the versions for database storage
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
          image_url: imageUrl,
          social_links: updatedGuest.socialLinks as any,
          notes: updatedGuest.notes,
          background_research: updatedGuest.backgroundResearch,
          background_research_versions: backgroundResearchVersionsString,
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
      
      setGuest(savedGuest);
      setIsEditing(false);
      
      // Refresh the guests list
      await refreshGuests();
      
      toast.success("Guest updated successfully");
      
      // Refetch to ensure we have the latest data
      await fetchGuest();
    } catch (error: any) {
      toast.error(`Failed to update guest: ${error.message}`);
      console.error("Error updating guest:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // If the guest has an image, delete it from storage
      if (guest?.imageUrl) {
        await deleteImage(guest.imageUrl);
      }
      
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);
      
      if (error) throw error;
      
      setIsDeleteDialogOpen(false);
      
      toast.success("Guest deleted successfully");
      
      await refreshGuests();
      
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
