
import { useState, useEffect, useCallback } from 'react';
import { Episode, Guest } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthProxy } from '@/hooks/useAuthProxy';

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthProxy();

  const refreshEpisodes = useCallback(async () => {
    if (!user) {
      console.log('No user, cannot fetch episodes');
      setEpisodes([]);
      setIsLoading(false);
      return [];
    }
    
    setIsLoading(true);
    
    try {
      // Fetch episodes
      const { data: episodeData, error: episodeError } = await supabase
        .from('episodes')
        .select('*')
        .order('scheduled', { ascending: false });
      
      if (episodeError) {
        throw episodeError;
      }
      
      // Fetch guests
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*');
      
      if (guestError) {
        throw guestError;
      }
      
      // Fetch episode-guest relationships
      const { data: episodeGuestsData, error: episodeGuestsError } = await supabase
        .from('episode_guests')
        .select('*');
      
      if (episodeGuestsError) {
        throw episodeGuestsError;
      }
      
      // Process episodes to include guest IDs
      const processedEpisodes = episodeData.map((episode: any) => {
        // Find guest relationships for this episode
        const episodeGuestRelations = episodeGuestsData?.filter(
          (relation: any) => relation.episode_id === episode.id
        ) || [];
        
        // Extract guest IDs
        const guestIds = episodeGuestRelations.map(
          (relation: any) => relation.guest_id
        );
        
        // Return episode with guest IDs
        return {
          ...episode,
          guestIds
        };
      });
      
      setEpisodes(processedEpisodes);
      setGuests(guestData || []);
      setIsLoading(false);
      
      return processedEpisodes;
    } catch (error: any) {
      console.error('Error fetching episodes:', error);
      toast({
        title: 'Error fetching episodes',
        description: error.message,
        variant: 'destructive'
      });
      
      setIsLoading(false);
      return [];
    }
  }, [user]);
  
  useEffect(() => {
    refreshEpisodes();
  }, [refreshEpisodes]);
  
  return {
    episodes,
    guests,
    isLoading,
    refreshEpisodes
  };
}
