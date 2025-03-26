
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCoverArtHandler } from '../useCoverArtHandler';
import { useAuth } from '@/contexts/AuthContext';

export function useEpisodeDelete(episodeId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { refreshEpisodes } = useAuth();
  const { handleCoverArtUpload } = useCoverArtHandler();

  const handleDelete = useCallback(async () => {
    if (!episodeId) return { success: false };
    
    setIsLoading(true);
    try {
      // Find episode to get cover art before deletion
      const { data: episodeData } = await supabase
        .from('episodes')
        .select('cover_art')
        .eq('id', episodeId)
        .single();
      
      // Delete cover art from storage if it exists
      if (episodeData?.cover_art) {
        await handleCoverArtUpload(undefined);
      }
      
      // Delete episode-guest relationships
      const { error: guestsError } = await supabase
        .from('episode_guests')
        .delete()
        .eq('episode_id', episodeId);
      
      if (guestsError) throw guestsError;
      
      // Delete the episode
      const { error } = await supabase
        .from('episodes')
        .delete()
        .eq('id', episodeId);
      
      if (error) throw error;
      
      toast.success("Episode deleted successfully");
      
      // Refresh episodes data
      await refreshEpisodes();
      
      // Navigate back to episodes list
      navigate('/episodes');
      
      return { success: true };
    } catch (error: any) {
      toast.error(`Error deleting episode: ${error.message}`);
      console.error("Error deleting episode:", error);
      return { success: false };
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  }, [episodeId, navigate, refreshEpisodes, handleCoverArtUpload]);

  return {
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete
  };
}
