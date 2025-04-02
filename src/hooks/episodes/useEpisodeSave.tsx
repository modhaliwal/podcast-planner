
import { useState } from "react";
import { updateEpisode } from "@/services/episodeService";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Episode } from "@/lib/types";
import { useEpisodeGuests } from "@/hooks/useEpisodeGuests";

export const useEpisodeSave = (episodeId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  // Add the episode guests hook
  const { updateEpisodeGuests } = useEpisodeGuests();
  
  const handleSave = async (data: Partial<Episode>): Promise<{ success: boolean; error?: Error }> => {
    if (!episodeId) {
      return { 
        success: false, 
        error: new Error("Episode ID is required for saving") 
      };
    }
    
    setIsSaving(true);
    
    try {
      // Extract guestIds from data before sending to updateEpisode
      const { guestIds, ...episodeData } = data;
      
      // Update the episode data
      const { success, error } = await updateEpisode(episodeId, episodeData);
      
      if (!success) {
        throw new Error(error?.message || "Failed to save episode");
      }
      
      // Update guest relationships if guestIds are provided
      if (guestIds && guestIds.length >= 0) {
        const guestUpdateSuccess = await updateEpisodeGuests(guestIds, episodeId);
        
        if (!guestUpdateSuccess) {
          console.error("Failed to update episode-guest relationships");
          // Don't throw error here, as the episode update was successful
        }
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
