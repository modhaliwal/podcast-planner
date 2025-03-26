
import { useEpisodeLoader } from './useEpisodeLoader';
import { useEpisodeSave } from './useEpisodeSave';
import { useEpisodeDelete } from './useEpisodeDelete';

export function useEpisodeData(episodeId: string | undefined) {
  // Use our specialized hooks
  const { isLoading: isLoadingEpisode, episode, refreshEpisode } = useEpisodeLoader(episodeId);
  const { isSubmitting: isSaving, handleSave } = useEpisodeSave(episodeId);
  const { 
    isLoading: isDeleting, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    handleDelete 
  } = useEpisodeDelete(episodeId);

  // Combine loading states
  const isLoading = isLoadingEpisode || isSaving || isDeleting;

  return {
    isLoading,
    episode,
    refreshEpisode,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleSave,
    handleDelete
  };
}
