
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Episode } from "@/lib/types";
import { episodeRepository } from "@/repositories/EpisodeRepository";

export const useEpisodeSave = (episodeId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSave = async (data: Partial<Episode>): Promise<{ success: boolean; error?: Error }> => {
    if (!episodeId) {
      return { 
        success: false, 
        error: new Error("Episode ID is required for saving") 
      };
    }
    
    setIsSaving(true);
    
    try {
      // Update the episode using the repository
      const { success, error } = await episodeRepository.update(episodeId, data);
      
      if (!success) {
        throw new Error(error?.message || "Failed to save episode");
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
