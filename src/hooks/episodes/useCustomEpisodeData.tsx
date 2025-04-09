
import { useState, useCallback, useEffect } from 'react';
import { useAuthProxy } from '@/hooks/useAuthProxy';
import { Episode } from '@/lib/types';
import { EpisodeStatus } from '@/lib/enums';

export function useCustomEpisodeData(episodeId?: string) {
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
      console.log(`Fetching episode with ID: ${episodeId}, token: ${token?.substring(0, 10)}...`);
      
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
            title: "Mock Episode Title",
            topic: "Technology",
            episodeNumber: 1,
            status: EpisodeStatus.SCHEDULED, // Changed from PLANNED to SCHEDULED
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
        // Check if response is a real Response object with text method
        if (response instanceof Response) {
          console.error("Error fetching episode:", await response.text());
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
