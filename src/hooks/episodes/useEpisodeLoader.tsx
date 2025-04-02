
import { useQuery } from "@tanstack/react-query";
import { getEpisode } from "@/services/episodeService";
import { useParams } from "react-router-dom";
import { Episode } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useEpisodeLoader = (episodeId?: string) => {
  const { id: paramId } = useParams<{ id: string }>();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Use provided episodeId or fall back to URL parameter
  const id = episodeId || paramId;
  
  const {
    data: episode,
    isLoading,
    error,
    refetch: refreshEpisode
  } = useQuery({
    queryKey: ["episode", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Episode ID is required");
      }
      
      // Fetch episode data
      const { data, error } = await getEpisode(id);
      
      if (error) {
        throw new Error(`Failed to load episode: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("Episode not found");
      }
      
      // Additionally fetch guest relationships
      const { data: guestRelations, error: guestError } = await supabase
        .from('episode_guests')
        .select('guest_id')
        .eq('episode_id', id);
      
      if (guestError) {
        throw new Error(`Failed to load episode guests: ${guestError.message}`);
      }
      
      // Ensure guestIds is populated correctly
      data.guestIds = guestRelations?.map(rel => rel.guest_id) || [];
      
      return data as Episode;
    },
    enabled: !!id,
    staleTime: 60000, // Cache data for 1 minute to prevent excessive refetching
    cacheTime: 300000, // Keep cached data for 5 minutes
  });
  
  return {
    episode,
    isLoading,
    error,
    isRedirecting,
    setIsRedirecting,
    refreshEpisode
  };
};
