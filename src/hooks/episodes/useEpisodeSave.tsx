
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Episode, ContentVersion } from '@/lib/types';

export function useEpisodeSave(episodeId: string | undefined, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = useCallback(
    async (updatedEpisode: Partial<Episode>) => {
      if (!episodeId) return { success: false };
      
      setIsSubmitting(true);
      try {
        console.log('Saving episode:', updatedEpisode);
        
        // First, update the episode data
        const { error } = await supabase
          .from('episodes')
          .update({
            title: updatedEpisode.title,
            number: updatedEpisode.number,
            status: updatedEpisode.status,
            type: updatedEpisode.type,
            season: updatedEpisode.season,
            scheduled: updatedEpisode.scheduled,
            recorded: updatedEpisode.recorded,
            published: updatedEpisode.published,
            topic: updatedEpisode.topic,
            summary: updatedEpisode.summary,
            introduction: updatedEpisode.introduction,
            notes: updatedEpisode.notes,
            resources: updatedEpisode.resources,
            podcast_url: updatedEpisode.podcastUrl,
            youtube_url: updatedEpisode.youtubeUrl,
            spotify_url: updatedEpisode.spotifyUrl,
            apple_url: updatedEpisode.appleUrl,
            google_url: updatedEpisode.googleUrl,
            cover_art: updatedEpisode.coverArt,
            notes_versions: updatedEpisode.notesVersions ? 
              (updatedEpisode.notesVersions as any) : null
          })
          .eq('id', episodeId);
        
        if (error) throw error;
        
        // Then, update the episode-guest relationships
        if (updatedEpisode.guestIds) {
          // First, delete all existing relationships
          const { error: deleteError } = await supabase
            .from('episode_guests')
            .delete()
            .eq('episode_id', episodeId);
          
          if (deleteError) throw deleteError;
          
          // Then add the new relationships
          if (updatedEpisode.guestIds.length > 0) {
            const episodeGuests = updatedEpisode.guestIds.map(guestId => ({
              episode_id: episodeId,
              guest_id: guestId
            }));
            
            const { error: insertError } = await supabase
              .from('episode_guests')
              .insert(episodeGuests);
            
            if (insertError) throw insertError;
          }
        }
        
        toast({
          title: "Success",
          description: "Episode saved successfully",
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        return { success: true };
      } catch (error: any) {
        console.error('Error saving episode:', error);
        toast({
          title: "Error",
          description: `Failed to save episode: ${error.message}`,
          variant: "destructive",
        });
        return { success: false, error };
      } finally {
        setIsSubmitting(false);
      }
    },
    [episodeId, onSuccess]
  );
  
  return {
    isSubmitting,
    handleSave
  };
}
