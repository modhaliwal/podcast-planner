
import { useState, useEffect, useCallback } from 'react';
import { Episode } from '@/lib/types';
import { useAuthProxy } from '@/hooks/useAuthProxy';

export function useEpisodesData() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAuthProxy();

  const fetchEpisodes = useCallback(async () => {
    if (!token) {
      setEpisodes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // This would normally fetch from an API
      console.log("Fetching episodes with token:", token?.substring(0, 10));
      
      // Mock implementation with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockEpisodes: Episode[] = [
        {
          id: '1',
          title: 'Getting Started with React',
          episodeNumber: 1,
          status: 'published',
          guestIds: ['guest-1'],
          scheduled: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          topic: 'Development'
        },
        {
          id: '2',
          title: 'Advanced TypeScript Patterns',
          episodeNumber: 2,
          status: 'scheduled',
          guestIds: ['guest-2'],
          scheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          topic: 'TypeScript'
        }
      ];
      
      setEpisodes(mockEpisodes);
    } catch (err) {
      console.error("Error fetching episodes:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch episodes'));
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  return {
    episodes,
    isLoading,
    error,
    refreshEpisodes: fetchEpisodes
  };
}

// Add default export for backward compatibility
export default useEpisodesData;
