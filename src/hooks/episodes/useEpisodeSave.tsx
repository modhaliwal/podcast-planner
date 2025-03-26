
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/toast';
import { Episode, ContentVersion } from '@/lib/types';
import { processVersions } from '@/lib/versionUtils';

export function useEpisodeSave(episodeId: string | undefined, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = useCallback(
    async (updatedEpisode: Partial<Episode>) => {
      if (!episodeId) return { success: false };
      
      setIsSubmitting(true);
      try {
        console.log('Saving episode:', updatedEpisode);
        
        // Process notesVersions to ensure proper format before saving
        let notesVersionsToSave = null;
        if (updatedEpisode.notesVersions) {
          const processedVersions = processVersions(updatedEpisode.notesVersions);
          notesVersionsToSave = processedVersions.length > 0 ? 
            JSON.stringify(processedVersions) : null;
          
          console.log('Processed notesVersions for saving:', {
            input: updatedEpisode.notesVersions,
            processed: processedVersions,
            stringified: notesVersionsToSave
          });
        }
        
        // First, update the episode data
        const { error } = await supabase
          .from('episodes')
          .update({
            title: updatedEpisode.title,
            episode_number: updatedEpisode.episodeNumber,
            status: updatedEpisode.status,
            scheduled: updatedEpisode.scheduled,
            publish_date: updatedEpisode.publishDate,
            topic: updatedEpisode.topic,
            introduction: updatedEpisode.introduction,
            notes: updatedEpisode.notes,
            resources: updatedEpisode.resources ? JSON.stringify(updatedEpisode.resources) : null,
            podcast_urls: updatedEpisode.podcastUrls ? {
              spotify: updatedEpisode.podcastUrls.spotify,
              youtube: updatedEpisode.podcastUrls.youtube,
              applePodcasts: updatedEpisode.podcastUrls.applePodcasts,
              amazonPodcasts: updatedEpisode.podcastUrls.amazonPodcasts
            } : null,
            cover_art: updatedEpisode.coverArt,
            notes_versions: notesVersionsToSave
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
        
        toast.success("Episode saved successfully");
        
        if (onSuccess) {
          onSuccess();
        }
        
        return { success: true };
      } catch (error: any) {
        console.error('Error saving episode:', error);
        toast.error(`Failed to save episode: ${error.message}`);
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
