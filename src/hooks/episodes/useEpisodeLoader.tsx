
import { useState, useCallback, useEffect } from 'react';
import { Episode } from '@/lib/types';
import { repositories } from '@/repositories';
import { toast } from '@/hooks/use-toast';

export function useEpisodeLoader(episodeId: string | undefined) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshEpisode = useCallback(async () => {
    if (!episodeId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Use the repository pattern to fetch the episode
      const fetchedEpisode = await repositories.episodes.getById(episodeId);
      
      if (!fetchedEpisode) {
        throw new Error('Episode not found');
      }
      
      setEpisode(fetchedEpisode);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err?.message || 'Failed to load episode'));
      console.error('Error loading episode:', err);
      toast({
        title: 'Error loading episode',
        description: err.message || 'Failed to load episode data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [episodeId]);

  useEffect(() => {
    refreshEpisode();
  }, [refreshEpisode]);

  return {
    episode,
    isLoading,
    error,
    refreshEpisode
  };
}
