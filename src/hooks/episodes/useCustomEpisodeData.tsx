
import { useState, useCallback, useEffect } from "react";
import { Episode } from "@/lib/types";
import { useAuthProxy } from "@/hooks/useAuthProxy";

export function useCustomEpisodeData(episodeId: string | undefined) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthProxy();
  
  const fetchEpisode = useCallback(async () => {
    if (!episodeId) {
      setIsLoading(false);
      return null;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from your API using the token
      console.log(`Fetching episode with ID: ${episodeId}, token: ${token?.substring(0, 10) || 'none'}...`);
      
      // For now, we're using a mock implementation
      // This simulates a network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate fetching episode data from API
      const mockResponse = {
        ok: true,
        json: async () => ({
          id: episodeId,
          title: "Mock Episode",
          topic: "Technology",
          episodeNumber: 1,
          status: "scheduled" as const,  // Using 'as const' to specify the literal type
          scheduled: new Date().toISOString(),
          guestIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          podcastUrls: {
            spotify: null,
            applePodcasts: null,
            amazonPodcasts: null,
            youtube: null
          }
        })
      };
      
      if (mockResponse.ok) {
        const data = await mockResponse.json();
        setEpisode(data);
      } else {
        console.error("Error fetching episode: Mock error");
        setEpisode(null);
      }
    } catch (error) {
      console.error("Error fetching episode:", error);
      setEpisode(null);
    } finally {
      setIsLoading(false);
    }
  }, [episodeId, token]);
  
  useEffect(() => {
    fetchEpisode();
  }, [fetchEpisode]);
  
  return {
    episode,
    isLoading,
    refreshEpisode: fetchEpisode
  };
}
