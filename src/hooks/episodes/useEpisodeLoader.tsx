
import { useQuery } from "@tanstack/react-query";
import { episodeRepository } from "@/repositories/EpisodeRepository";
import { useParams } from "react-router-dom";
import { Episode } from "@/lib/types";
import { useState, useMemo } from "react";

export const useEpisodeLoader = (episodeId?: string) => {
  const { id: paramId } = useParams<{ id: string }>();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Use provided episodeId or fall back to URL parameter
  const id = useMemo(() => episodeId || paramId, [episodeId, paramId]);
  
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
      
      // Use the repository pattern to fetch episode data
      const { data, error } = await episodeRepository.getById(id);
      
      if (error) {
        throw new Error(`Failed to load episode: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("Episode not found");
      }
      
      return data as Episode;
    },
    enabled: !!id,
    staleTime: 60000, // Cache data for 1 minute to prevent excessive refetching
    gcTime: 300000, // Keep cached data for 5 minutes
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
