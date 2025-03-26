import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapEpisodeFromDB } from '@/services/episodeService';
import { Episode } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/toast';

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
    setEpisode,
    refreshEpisode
  };
}
