
import { useState } from "react";
import { updateEpisode } from "@/services/episodeService";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Episode } from "@/lib/types";

export const useEpisodeSave = () => {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  
  const saveEpisode = async (episodeId: string, data: Partial<Episode>): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      // Prepare notes versions for storage if they exist
      if (data.notesVersions) {
        // AIGenerationField handles version management internally
        // Just ensure we're sending the right format to the database
        console.log("Saving notes versions:", data.notesVersions);
      }
      
      const { success, error } = await updateEpisode(episodeId, {
        ...data,
        // Ensure we're sending arrays for versions
        notes_versions: data.notesVersions || []
      });
      
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
      
      return true;
    } catch (error: any) {
      console.error("Error saving episode:", error);
      
      toast({
        title: "Error saving episode",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    saveEpisode,
    isSaving,
  };
};
