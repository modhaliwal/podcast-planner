
import { UseFormReturn } from "react-hook-form";
import { EpisodeFormValues } from "../../EpisodeFormSchema";
import { Guest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NotesGenerationProps {
  guests: Guest[];
  onNotesGenerated: (notes: string) => void;
  form: UseFormReturn<EpisodeFormValues>;
}

export function NotesGeneration({ guests, onNotesGenerated, form }: NotesGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const selectedGuestIds = form.watch('guestIds') || [];
  const topic = form.watch('topic') || '';
  
  // Find selected guests from the full guests array
  const selectedGuests = guests.filter(g => selectedGuestIds.includes(g.id));
  
  const handleGenerateNotes = async () => {
    if (!topic) {
      toast({
        title: "Warning",
        description: "Please add a topic before generating notes",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedGuests.length === 0) {
      toast({
        title: "Warning", 
        description: "Please select at least one guest before generating notes",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const guestInfo = selectedGuests.map(guest => ({
        id: guest.id,
        name: guest.name,
        bio: guest.bio || '',
        company: guest.company || '',
        title: guest.title || ''
      }));
      
      const { data, error } = await supabase.functions.invoke('generate-episode-notes', {
        body: {
          topic,
          guests: guestInfo,
        }
      });
      
      if (error) throw error;
      
      if (data?.content) {
        onNotesGenerated(data.content);
        toast({
          title: "Success",
          description: "Episode notes generated successfully"
        });
      } else {
        throw new Error('No content returned from the API');
      }
    } catch (error: any) {
      console.error('Error generating notes:', error);
      toast({
        title: "Error",
        description: `Failed to generate notes: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <Button 
        variant="outline" 
        type="button" 
        className="w-full md:w-auto"
        onClick={handleGenerateNotes}
        disabled={isGenerating || !topic || selectedGuestIds.length === 0}
      >
        <SparkleIcon className="h-4 w-4 mr-2" />
        {isGenerating ? 'Generating...' : 'Generate Notes with AI'}
      </Button>
      
      {!topic && (
        <p className="text-sm text-muted-foreground">
          Add a topic to enable AI note generation
        </p>
      )}
      
      {topic && selectedGuestIds.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Select at least one guest to enable AI note generation
        </p>
      )}
    </div>
  );
}
