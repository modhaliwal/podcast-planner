
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
      const response = await fetch(`/api/episodes/${episodeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => {
        // If fetch fails (e.g., in development without a real API)
        // return a mock episode
        console.log("Using mock episode data");
        return {
          ok: true,
          json: async () => ({
            id: episodeId,
            title: "Mock Episode",
            topic: "Technology",
            episodeNumber: 1,
            status: "scheduled",  // Using 'scheduled' instead of enum value
            scheduled: new Date().toISOString(),
            guestIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        };
      });
      
      if (response.ok) {
        const data = await response.json();
        setEpisode(data);
      } else {
        // Handle error based on whether it's a real Response object or our mock
        if (response instanceof Response) {
          const errorText = await response.text();
          console.error("Error fetching episode:", errorText);
        } else {
          console.error("Error fetching episode: Unknown error");
        }
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
