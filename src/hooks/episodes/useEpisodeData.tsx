
import { useEpisodeLoader } from './useEpisodeLoader';
import { useEpisodeSave } from './useEpisodeSave';
import { useEpisodeDelete } from './useEpisodeDelete';

export function useEpisodeData(episodeId: string | undefined) {
  // Use our specialized hooks
  const { isLoading: isLoadingEpisode, episode, setEpisode } = useEpisodeLoader(episodeId);
  const { isLoading: isSaving, handleSave } = useEpisodeSave(episodeId);
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
    setEpisode,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleSave,
    handleDelete
  };
}
