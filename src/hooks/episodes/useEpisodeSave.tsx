
import { useState, useCallback } from 'react';
import { Episode } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useCoverArtHandler } from '../useCoverArtHandler';
import { useEpisodeGuests } from '../useEpisodeGuests';
import { useAuth } from '@/contexts/AuthContext';
import { processVersions } from '@/lib/versionUtils';

export function useEpisodeSave(episodeId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshEpisodes } = useAuth();
  const { handleCoverArtUpload } = useCoverArtHandler();
  const { updateEpisodeGuests } = useEpisodeGuests();

  const handleSave = useCallback(async (updatedEpisode: Episode) => {
    if (!episodeId) return { success: false };
    
    setIsLoading(true);
    
    try {
      const processedCoverArt = await handleCoverArtUpload(updatedEpisode.coverArt);
      
      // Convert our typed objects to JSON-compatible objects for Supabase
      const recordingLinksJson = updatedEpisode.recordingLinks ? {
        audio: updatedEpisode.recordingLinks.audio,
        video: updatedEpisode.recordingLinks.video,
        transcript: updatedEpisode.recordingLinks.transcript,
        other: updatedEpisode.recordingLinks.other || [],
      } : null;
      
      const podcastUrlsJson = updatedEpisode.podcastUrls ? {
        spotify: updatedEpisode.podcastUrls.spotify,
        applePodcasts: updatedEpisode.podcastUrls.applePodcasts,
        amazonPodcasts: updatedEpisode.podcastUrls.amazonPodcasts,
        youtube: updatedEpisode.podcastUrls.youtube,
      } : null;
      
      const resourcesJson = updatedEpisode.resources ? 
        updatedEpisode.resources.map(resource => ({
          label: resource.label || '',
          url: resource.url || '',
          description: resource.description,
        })) : null;
      
      // Process version numbers and active flags
      const notesVersionsJson = processVersions(updatedEpisode.notesVersions || []);
      
      const { error: updateError } = await supabase
        .from('episodes')
        .update({
          title: updatedEpisode.title,
          episode_number: updatedEpisode.episodeNumber,
          topic: updatedEpisode.topic,
          introduction: updatedEpisode.introduction,
          notes: updatedEpisode.notes,
          notes_versions: notesVersionsJson,
          status: updatedEpisode.status,
          scheduled: updatedEpisode.scheduled,
          publish_date: updatedEpisode.publishDate,
          cover_art: processedCoverArt,
          recording_links: recordingLinksJson,
          podcast_urls: podcastUrlsJson,
          resources: resourcesJson,
          updated_at: new Date().toISOString()
        })
        .eq('id', episodeId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update guest relationships
      await updateEpisodeGuests(updatedEpisode.guestIds, episodeId);
      
      await refreshEpisodes();
      
      toast({
        title: "Success",
        description: "Episode updated successfully"
      });
      
      return { success: true, episode: updatedEpisode };
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error updating episode: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error updating episode:", error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [episodeId, handleCoverArtUpload, updateEpisodeGuests, refreshEpisodes]);

  return {
    isLoading,
    handleSave
  };
}
