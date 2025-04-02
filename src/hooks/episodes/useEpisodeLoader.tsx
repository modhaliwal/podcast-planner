
import { useQuery } from "@tanstack/react-query";
import { getEpisode } from "@/services/episodeService";
import { useParams } from "react-router-dom";
import { Episode } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

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
      
      const { data, error } = await getEpisode(id);
      
      if (error) {
        throw new Error(`Failed to load episode: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("Episode not found");
      }
      
      return data as Episode;
    },
    enabled: !!id,
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading episode",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error]);
  
  return {
    episode,
    isLoading,
    error,
    isRedirecting,
    setIsRedirecting,
    refreshEpisode
  };
};
