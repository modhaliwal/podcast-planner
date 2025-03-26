
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook to manage episode-guest relationships
 */
export function useEpisodeGuests() {
  const [isUpdatingGuests, setIsUpdatingGuests] = useState(false);
  
  /**
   * Updates the relationships between an episode and its guests
   * @param guestIds Array of guest IDs to associate with the episode
   * @param episodeId The episode ID to update relationships for
   */
  const updateEpisodeGuests = async (guestIds: string[], episodeId: string) => {
    setIsUpdatingGuests(true);
    
    try {
      console.log(`Updating episode-guest relationships for episode ${episodeId}`, { guestIds });
      
      // Delete existing relationships
      const { error: deleteError } = await supabase
        .from('episode_guests')
        .delete()
        .eq('episode_id', episodeId);
      
      if (deleteError) {
        console.error("Error deleting existing episode-guest relationships:", deleteError);
        throw deleteError;
      }
      
      // If there are new guest IDs, insert them
      if (guestIds.length > 0) {
        const episodeGuestsToInsert = guestIds.map(guestId => ({
          episode_id: episodeId,
          guest_id: guestId
        }));
        
        const { error: insertError } = await supabase
          .from('episode_guests')
          .insert(episodeGuestsToInsert);
        
        if (insertError) {
          console.error("Error inserting new episode-guest relationships:", insertError);
          throw insertError;
        }
        
        console.log(`Successfully updated ${guestIds.length} guest relationships for episode ${episodeId}`);
      }
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error updating guest relationships: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error in updateEpisodeGuests:", error);
      return false;
    } finally {
      setIsUpdatingGuests(false);
    }
  };
  
  return {
    isUpdatingGuests,
    updateEpisodeGuests
  };
}
