
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFormContext } from "react-hook-form";
import { EpisodeFormValues } from "../../EpisodeFormSchema";
import { Guest } from "@/lib/types";

interface NotesGenerationProps {
  guests: Guest[];
  onNotesGenerated: (notes: string) => void;
}

export function NotesGeneration({ 
  guests,
  onNotesGenerated 
}: NotesGenerationProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const form = useFormContext<EpisodeFormValues>();

  const generateNotes = async () => {
    try {
      setIsGenerating(true);
      toast.info("Generating episode notes...");
      
      // Get necessary data for generating notes
      const episodeData = {
        title: form.getValues("title") || "",
        topic: form.getValues("topic") || "",
        guestIds: form.getValues("guestIds") || []
      };
      
      if (!episodeData.title) {
        toast.warning("Please provide an episode title before generating notes");
        return;
      }
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-episode-notes', {
        body: {
          episode: episodeData,
          guests: guests
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.notes) {
        // Call the callback with generated notes
        onNotesGenerated(data.notes);
        
        toast.success("Notes generated successfully!");
      } else {
        throw new Error("No notes generated");
      }
    } catch (error: any) {
      console.error("Error generating notes:", error);
      toast.error(`Failed to generate notes: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={generateNotes}
      disabled={isGenerating}
    >
      <Sparkles className="h-4 w-4 mr-1" />
      {isGenerating ? "Generating..." : "Generate Notes"}
    </Button>
  );
}
