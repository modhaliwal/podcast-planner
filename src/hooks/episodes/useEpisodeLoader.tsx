
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapEpisodeFromDB } from '@/services/episodeService';
import { Episode, ContentVersion } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/toast';
import { processVersions } from '@/lib/versionUtils';

export function useEpisodeLoader(episodeId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const { refreshEpisodes } = useAuth();
  
  const fetchEpisode = useCallback(async () => {
    if (!episodeId) {
      setIsLoading(false);
      return null;
    }
    
    setIsLoading(true);
    
    try {
      console.log(`Loading episode with ID: ${episodeId}`);
      
      // Fetch episode data
      const { data: episodeData, error: episodeError } = await supabase
        .from('episodes')
        .select('*')
        .eq('id', episodeId)
        .single();
      
      if (episodeError) throw episodeError;
      
      if (!episodeData) {
        console.error('Episode not found:', episodeId);
        setEpisode(null);
        setIsLoading(false);
        return null;
      }
      
      // Fetch guest relationships
      const { data: guestRelationships, error: guestsError } = await supabase
        .from('episode_guests')
        .select('guest_id')
        .eq('episode_id', episodeId);
      
      if (guestsError) throw guestsError;
      
      // Extract guest IDs
      const guestIds = guestRelationships?.map(rel => rel.guest_id) || [];
      
      // Parse resources if it's a string
      let parsedResources = episodeData.resources;
      if (typeof episodeData.resources === 'string') {
        try {
          parsedResources = JSON.parse(episodeData.resources);
        } catch (e) {
          console.error('Error parsing resources JSON:', e);
          parsedResources = [];
        }
      } else if (!Array.isArray(episodeData.resources)) {
        // If resources exists but is not an array, set it to empty array
        parsedResources = [];
      }
      
      // Handle notes_versions which might be stringified JSON
      let notesVersions: ContentVersion[] = [];
      if (episodeData.notes_versions) {
        try {
          // If it's a string, parse it
          if (typeof episodeData.notes_versions === 'string') {
            const parsed = JSON.parse(episodeData.notes_versions);
            // Ensure we have a proper array to work with
            notesVersions = Array.isArray(parsed) ? parsed : [];
          } else if (Array.isArray(episodeData.notes_versions)) {
            // If it's already an array, use it directly
            notesVersions = episodeData.notes_versions;
          } else {
            // If it's an object but not an array, wrap it in an array
            notesVersions = [episodeData.notes_versions];
          }
          
          // Ensure we have valid versions with required properties
          notesVersions = processVersions(notesVersions);
          
          console.log("Processed notes versions:", notesVersions);
        } catch (e) {
          console.error('Error processing notes_versions:', e);
          notesVersions = [];
        }
      }
      
      // Map the database result to our Episode type
      const mappedEpisode = mapEpisodeFromDB({ 
        ...episodeData, 
        guestIds,
        resources: parsedResources,
        notes_versions: notesVersions
      });
      
      console.log('Loaded episode:', mappedEpisode);
      setEpisode(mappedEpisode);
      return mappedEpisode;
    } catch (error: any) {
      console.error('Error loading episode:', error);
      toast.error(error.message || "Could not load episode data");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [episodeId]);
  
  useEffect(() => {
    fetchEpisode();
  }, [fetchEpisode]);
  
  const refreshEpisode = async () => {
    await fetchEpisode();
    refreshEpisodes();
  };
  
  return {
    isLoading,
    episode,
    setEpisode,
    refreshEpisode
  };
}
