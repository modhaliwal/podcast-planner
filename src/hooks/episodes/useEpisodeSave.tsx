
import { useState, useCallback } from 'react';
import { Episode } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCoverArtHandler } from '../useCoverArtHandler';
import { useEpisodeGuests } from '../useEpisodeGuests';
import { useAuth } from '@/contexts/AuthContext';
import { ensureVersionNumbers } from '@/hooks/versions';

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
      
      // CRITICAL FIX: Properly process version numbers and active flags
      const notesVersions = updatedEpisode.notesVersions || [];
      const processedVersions = ensureVersionNumbers(notesVersions);
      
      // Make sure at least one version is active
      const hasActiveVersion = processedVersions.some(v => v.active);
      
      let finalVersions = processedVersions;
      if (!hasActiveVersion && processedVersions.length > 0) {
        // Mark the latest version as active
        const sortedVersions = [...processedVersions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        finalVersions = processedVersions.map(v => ({
          ...v,
          active: v.id === sortedVersions[0].id
        }));
      }
      
      const notesVersionsJson = finalVersions.map(version => ({
        id: version.id,
        content: version.content,
        timestamp: version.timestamp,
        source: version.source,
        active: version.active,
        versionNumber: version.versionNumber
      }));
      
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
      
      toast.success("Episode updated successfully");
      
      return { success: true, episode: updatedEpisode };
    } catch (error: any) {
      toast.error(`Error updating episode: ${error.message}`);
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
