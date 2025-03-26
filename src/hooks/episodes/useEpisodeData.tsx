
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Episode } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCoverArtHandler } from '../useCoverArtHandler';
import { useEpisodeGuests } from '../useEpisodeGuests';
import { useAuth } from '@/contexts/AuthContext';

export function useEpisodeData(episodeId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { episodes, refreshEpisodes } = useAuth();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const navigate = useNavigate();
  const { handleCoverArtUpload } = useCoverArtHandler();
  const { updateEpisodeGuests } = useEpisodeGuests();

  // Load episode data initially
  useEffect(() => {
    const fetchEpisode = async () => {
      if (!episodeId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // First try to get from context to avoid flickering
        const contextEpisode = episodes.find(e => e.id === episodeId);
        if (contextEpisode) {
          setEpisode(contextEpisode);
          setIsLoading(false);
          return;
        }
        
        // If not in context, fetch directly from database
        const { data, error } = await supabase
          .from('episodes')
          .select('*, episode_guests(guest_id)')
          .eq('id', episodeId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Convert from database format to app format
          const guestIds = data.episode_guests ? 
            data.episode_guests.map((eg: any) => eg.guest_id) : [];
            
          const formattedEpisode: Episode = {
            id: data.id,
            title: data.title,
            episodeNumber: data.episode_number,
            topic: data.topic,
            introduction: data.introduction || '',
            notes: data.notes || '',
            notesVersions: data.notes_versions || [],
            status: data.status,
            scheduled: data.scheduled,
            publishDate: data.publish_date,
            coverArt: data.cover_art,
            recordingLinks: data.recording_links,
            podcastUrls: data.podcast_urls,
            resources: data.resources || [],
            guestIds: guestIds,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          
          setEpisode(formattedEpisode);
        }
      } catch (error: any) {
        console.error('Error fetching episode:', error);
        toast.error('Failed to load episode data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEpisode();
  }, [episodeId, episodes]);

  const handleSave = useCallback(async (updatedEpisode: Episode) => {
    if (!episodeId) return { success: false };
    
    setIsLoading(true);
    
    try {
      const processedCoverArt = await handleCoverArtUpload(updatedEpisode.coverArt, episode?.coverArt);
      
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
          label: resource.label,
          url: resource.url,
          description: resource.description,
        })) : null;
      
      const notesVersionsJson = updatedEpisode.notesVersions ? 
        updatedEpisode.notesVersions.map(version => ({
          id: version.id,
          content: version.content,
          timestamp: version.timestamp,
          source: version.source,
        })) : null;
      
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
      setEpisode(updatedEpisode);
      
      return { success: true, episode: updatedEpisode };
    } catch (error: any) {
      toast.error(`Error updating episode: ${error.message}`);
      console.error("Error updating episode:", error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [episodeId, handleCoverArtUpload, updateEpisodeGuests, refreshEpisodes, episode]);

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
        await handleCoverArtUpload(undefined, episodeData.cover_art);
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
    episode,
    setEpisode,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleSave,
    handleDelete
  };
}
