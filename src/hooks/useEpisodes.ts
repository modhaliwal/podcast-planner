import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { episodeRepository } from '@/repositories';
import { CreateEpisodeDTO, UpdateEpisodeDTO } from '@/repositories/episodes/EpisodeDTO';
import { Episode } from '@/lib/types';
import { toast } from './use-toast';

// Query keys for episodes
export const episodeKeys = {
  all: ['episodes'] as const,
  lists: () => [...episodeKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...episodeKeys.lists(), filters] as const,
  details: () => [...episodeKeys.all, 'detail'] as const,
  detail: (id: string) => [...episodeKeys.details(), id] as const,
};

/**
 * Hook for fetching episodes with React Query
 */
export function useEpisodes(filters?: Record<string, any>) {
  return useQuery({
    queryKey: episodeKeys.list(filters || {}),
    queryFn: async () => {
      const { data, error } = await episodeRepository.getAll({ filters });
      if (error) throw error;
      return data || [];
    },
  });
}

/**
 * Hook for fetching a single episode with React Query
 */
export function useEpisode(id: string) {
  return useQuery({
    queryKey: episodeKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await episodeRepository.getById(id);
      if (error) throw error;
      if (!data) throw new Error(`Episode with ID ${id} not found`);
      return data;
    },
    enabled: !!id,
  });
}

/**
 * Hook for creating episodes
 */
export function useCreateEpisode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newEpisode: CreateEpisodeDTO) => 
      episodeRepository.create(newEpisode),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: episodeKeys.lists() });
      toast({
        title: 'Episode Created',
        description: `Episode "${result.data?.title}" has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Create Episode',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook for updating episodes
 */
export function useUpdateEpisode(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updatedEpisode: UpdateEpisodeDTO) => 
      episodeRepository.update(id, updatedEpisode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: episodeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: episodeKeys.lists() });
      toast({
        title: 'Episode Updated',
        description: 'Episode has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Update Episode',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook for deleting episodes
 */
export function useDeleteEpisode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => episodeRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: episodeKeys.lists() });
      toast({
        title: 'Episode Deleted',
        description: 'Episode has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Delete Episode',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
} 