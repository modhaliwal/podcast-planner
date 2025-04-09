
import { useState, useEffect, useCallback } from 'react';
import { Episode, Guest } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GuestMapper } from '@/repositories/guests/GuestMapper';
import { DBGuest } from '@/repositories/guests/GuestRepository';

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const guestMapper = new GuestMapper();

  const refreshEpisodes = useCallback(async () => {
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
      
      // Map guests from DB format to domain model
      const mappedGuests = (guestData || []).map(guest => {
        // Create a properly structured DBGuest object to pass to the mapper
        const dbGuest: DBGuest = {
          id: guest.id,
          name: guest.name,
          title: guest.title || null,
          company: guest.company || null,
          bio: guest.bio || '',
          email: guest.email || null,
          phone: guest.phone || null,
          location: null,  // Required in the interface but may not be in data
          image: null,     // Required in the interface but may not be in data
          image_url: guest.image_url || null,
          website: null,   // Required in the interface but may not be in data
          twitter: null,   // Required in the interface but may not be in data
          linkedin: null,  // Required in the interface but may not be in data
          notes: guest.notes || null,
          background_research: guest.background_research || null,
          status: guest.status || null,
          social_links: guest.social_links || {},
          bio_versions: guest.bio_versions || null,
          background_research_versions: guest.background_research_versions || null,
          created_at: guest.created_at,
          updated_at: guest.updated_at,
          user_id: guest.user_id
        };
        
        return guestMapper.toDomain(dbGuest);
      });
      
      setEpisodes(processedEpisodes);
      setGuests(mappedGuests);
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
  }, [guestMapper]);
  
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
