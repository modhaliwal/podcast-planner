
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Episode } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { deleteImage } from "@/lib/imageUpload";

export function useEpisodeData(
  id: string | undefined, 
  refreshEpisodes: () => Promise<void>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleDeleteEpisode = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Find episode to get cover art before deletion
      const { data: episodeData } = await supabase
        .from('episodes')
        .select('cover_art')
        .eq('id', id)
        .single();
      
      // Delete cover art from storage if it exists
      if (episodeData?.cover_art) {
        await deleteImage(episodeData.cover_art);
      }
      
      // Delete episode-guest relationships
      const { error: guestsError } = await supabase
        .from('episode_guests')
        .delete()
        .eq('episode_id', id);
      
      if (guestsError) throw guestsError;
      
      // Delete the episode
      const { error } = await supabase
        .from('episodes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Episode deleted successfully"
      });
      
      // Refresh episodes data
      await refreshEpisodes();
      
      // Navigate back to episodes list
      navigate('/episodes');
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error deleting episode: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error deleting episode:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  }, [id, navigate, refreshEpisodes]);

  return {
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteEpisode
  };
}
