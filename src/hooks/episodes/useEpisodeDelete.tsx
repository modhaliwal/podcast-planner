import { useState } from 'react';
import { repositories } from '@/repositories';
import { toast } from '@/hooks/toast/use-toast';

export function useEpisodeDelete(episodeId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = async () => {
    if (!episodeId) return { success: false };
    
    setIsLoading(true);
    try {
      // Delete the episode using repository
      const success = await repositories.episodes.delete(episodeId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Episode deleted successfully"
        });
        
        return { success: true };
      } else {
        toast({
          title: "Error",
          description: "Unable to delete episode",
          variant: "destructive"
        });
        return { success: false };
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error deleting episode: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error deleting episode:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete
  };
}
