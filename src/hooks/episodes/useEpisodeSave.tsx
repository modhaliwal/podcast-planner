
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { episodeRepository } from "@/repositories";
import { UpdateEpisodeDTO } from "@/repositories/episodes/EpisodeDTO";

export const useEpisodeSave = (episodeId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSave = async (data: UpdateEpisodeDTO): Promise<{ success: boolean; error?: Error }> => {
    if (!episodeId) {
      return { 
        success: false, 
        error: new Error("Episode ID is required for saving") 
      };
    }
    
    setIsSaving(true);
    
    try {
      // Update the episode using the repository
      const updatedEpisode = await episodeRepository.update(episodeId, data);
      
      if (!updatedEpisode) {
        throw new Error("Failed to save episode");
      }
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["episode", episodeId] });
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
      
      toast({
        title: "Episode saved",
        description: "Your changes have been saved successfully.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Error saving episode:", error);
      
      toast({
        title: "Error saving episode",
        description: error.message,
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    isSaving,
    handleSave
  };
};
