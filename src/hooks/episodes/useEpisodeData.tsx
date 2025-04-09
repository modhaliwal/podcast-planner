
import { useEpisodeLoader } from './useEpisodeLoader';
import { useEpisodeSave } from './useEpisodeSave';
import { useEpisodeDelete } from './useEpisodeDelete';
import { UpdateEpisodeDTO } from '@/repositories/episodes/EpisodeDTO';

export function useEpisodeData(episodeId?: string) {
  // Use our specialized hooks
  const { 
    episode, 
    isLoading: isLoadingEpisode, 
    refreshEpisode
  } = useEpisodeLoader(episodeId);
  
  const { 
    isSaving, 
    handleSave 
  } = useEpisodeSave(episodeId);
  
  const { 
    isLoading: isDeleting, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    handleDelete 
  } = useEpisodeDelete(episodeId);

  // Combine loading states
  const isLoading = isLoadingEpisode || isSaving || isDeleting;
  
  // Define a standard save handler that accepts the updated episode
  const onSave = async (updatedEpisode: UpdateEpisodeDTO) => {
    if (!episodeId) {
      return { success: false, error: new Error('Episode ID is required for saving') };
    }
    
    return handleSave(updatedEpisode);
  };

  return {
    isLoading,
    isSaving,
    episode,
    refreshEpisode,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleSave: onSave,
    handleDelete
  };
}
