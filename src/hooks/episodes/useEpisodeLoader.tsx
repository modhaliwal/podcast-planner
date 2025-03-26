
import { useState, useEffect } from 'react';
import { Episode, ContentVersion } from '@/lib/types';
import { EpisodeStatus } from '@/lib/enums';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ensureVersionNumbers } from '@/lib/versionUtils';

export function useEpisodeLoader(episodeId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const { episodes } = useAuth();

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
            
          // Properly cast the status to EpisodeStatus enum
          const statusValue = data.status as keyof typeof EpisodeStatus;
          
          // Properly parse JSON fields with type checking
          const recordingLinks = data.recording_links ? (
            typeof data.recording_links === 'string' 
              ? JSON.parse(data.recording_links) 
              : data.recording_links
          ) : undefined;
          
          const podcastUrls = data.podcast_urls ? (
            typeof data.podcast_urls === 'string' 
              ? JSON.parse(data.podcast_urls) 
              : data.podcast_urls
          ) : undefined;
          
          const resources = data.resources ? (
            typeof data.resources === 'string' 
              ? JSON.parse(data.resources) 
              : (Array.isArray(data.resources) ? data.resources : [])
          ) : [];
          
          // Parse the notes_versions field and ensure version numbers
          let notesVersions: ContentVersion[] = [];
          try {
            notesVersions = data.notes_versions ? (
              typeof data.notes_versions === 'string'
                ? JSON.parse(data.notes_versions)
                : (Array.isArray(data.notes_versions) ? data.notes_versions : [])
            ) : [];
            
            // Ensure all versions have version numbers
            notesVersions = ensureVersionNumbers(notesVersions);
          } catch (e) {
            console.error("Error parsing notes versions for episode", data.id, e);
          }
          
          // Create properly typed Episode object
          const formattedEpisode: Episode = {
            id: data.id,
            title: data.title,
            episodeNumber: data.episode_number,
            topic: data.topic,
            introduction: data.introduction || '',
            notes: data.notes || '',
            notesVersions: notesVersions,
            status: statusValue as EpisodeStatus,
            scheduled: data.scheduled,
            publishDate: data.publish_date,
            coverArt: data.cover_art,
            recordingLinks: recordingLinks,
            podcastUrls: podcastUrls,
            resources: resources,
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

  return {
    isLoading,
    episode,
    setEpisode
  };
}
