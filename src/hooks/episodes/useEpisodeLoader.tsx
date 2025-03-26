
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapEpisodeFromDB } from '@/services/episodeService';
import { Episode } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
      
      // Map the database result to our Episode type
      const mappedEpisode = mapEpisodeFromDB({ 
        ...episodeData, 
        guestIds 
      });
      
      // Process the versions
      if (mappedEpisode.notesVersions) {
        // Ensure each version has the required fields
        mappedEpisode.notesVersions = mappedEpisode.notesVersions.map(version => {
          // If the version is missing any required fields, add them with default values
          if (!version.id) version.id = crypto.randomUUID();
          if (!version.timestamp) version.timestamp = new Date().toISOString();
          if (!version.source) version.source = "manual";
          if (!version.versionNumber) version.versionNumber = 1;
          if (version.active === undefined) version.active = false;
          return version;
        });
        
        // Ensure at least one version is active
        const hasActiveVersion = mappedEpisode.notesVersions.some(v => v.active);
        if (!hasActiveVersion && mappedEpisode.notesVersions.length > 0) {
          const latestVersion = [...mappedEpisode.notesVersions].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          latestVersion.active = true;
        }
      }
      
      console.log('Loaded episode:', mappedEpisode);
      setEpisode(mappedEpisode);
      return mappedEpisode;
    } catch (error: any) {
      console.error('Error loading episode:', error);
      toast({
        title: "Error loading episode",
        description: error.message || "Could not load episode data",
        variant: "destructive",
      });
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
    refreshEpisode
  };
}
