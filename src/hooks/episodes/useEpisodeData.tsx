import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Episode } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCoverArtHandler } from "../useCoverArtHandler";
import { useEpisodeGuests } from "../useEpisodeGuests";

export function useEpisodeData(episodeId: string | undefined, episodes: Episode[], refreshEpisodes: () => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [episode, setEpisode] = useState<Episode | null>(
    episodes.find(e => e.id === episodeId) || null
  );
  const navigate = useNavigate();
  const { handleCoverArtUpload } = useCoverArtHandler(episode?.coverArt);
  const { updateEpisodeGuests } = useEpisodeGuests();

  const handleSave = async (updatedEpisode: Episode) => {
    if (!episodeId) return { success: false };
    
    setIsLoading(true);
    
    try {
      const processedCoverArt = await handleCoverArtUpload(updatedEpisode.coverArt);
      
      const { error: updateError } = await supabase
        .from('episodes')
        .update({
          title: updatedEpisode.title,
          episode_number: updatedEpisode.episodeNumber,
          topic: updatedEpisode.topic,
          introduction: updatedEpisode.introduction,
          notes: updatedEpisode.notes,
          notes_versions: updatedEpisode.notesVersions,
          status: updatedEpisode.status,
          scheduled: updatedEpisode.scheduled,
          publish_date: updatedEpisode.publishDate,
          cover_art: processedCoverArt,
          recording_links: updatedEpisode.recordingLinks,
          podcast_urls: updatedEpisode.podcastUrls,
          resources: updatedEpisode.resources,
          updated_at: new Date().toISOString()
        })
        .eq('id', episodeId)
        .select();
      
      if (updateError) {
        throw updateError;
      }
      
      // Update guest relationships
      await updateEpisodeGuests(updatedEpisode.guestIds, episodeId);
      
      await refreshEpisodes();
      
      toast.success("Episode updated successfully");
      
      return { success: true, episode: updatedEpisode };
    } catch (error: any) {
      toast.error(`Error updating episode: ${error.message}`);
      console.error("Error updating episode:", error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
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
  };

  return {
    isLoading,
    episode,
    setEpisode,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleSave,
    handleDelete
  };
}
