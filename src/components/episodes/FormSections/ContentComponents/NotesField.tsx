
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { BookText, Sparkles } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { Guest } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAIPrompts } from '@/hooks/useAIPrompts';

interface NotesFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests?: Guest[];
}

export function NotesField({ form, guests = [] }: NotesFieldProps) {
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const { getPromptByKey } = useAIPrompts();
  
  const handleGenerateNotes = async () => {
    const topic = form.getValues('topic');
    
    // Validation check for topic only
    if (!topic) {
      toast.warning("Please add a topic before generating notes");
      return;
    }
    
    try {
      setIsGeneratingNotes(true);
      toast.info("Generating episode notes with research about this topic. This may take a minute...");
      
      // Get the prompt from the database with all fields
      const promptData = getPromptByKey('episode_notes_generator');
      
      if (!promptData) {
        throw new Error("Episode notes generator prompt not found");
      }
      
      console.log("Retrieved prompt data:", promptData);
      
      // Replace variables in the prompt template
      const prompt = promptData.prompt_text.replace('${topic}', topic);
      
      console.log("Calling generate-episode-notes function with topic:", topic);
      console.log("Using prompt:", prompt);
      
      // Build request body with all available prompt components
      const requestBody: any = {
        topic,
        prompt
      };
      
      // Add optional fields if they exist
      if (promptData.system_prompt) {
        requestBody.systemPrompt = promptData.system_prompt;
      }
      
      if (promptData.context_instructions) {
        requestBody.contextInstructions = promptData.context_instructions;
      }
      
      if (promptData.example_output) {
        requestBody.exampleOutput = promptData.example_output;
      }
      
      // Call the Supabase function to generate notes
      const { data, error } = await supabase.functions.invoke('generate-episode-notes', {
        body: requestBody
      });
      
      console.log("Function response:", data, error);
      
      if (error) {
        throw new Error(error.message || "Failed to generate notes");
      }
      
      if (!data?.notes) {
        throw new Error("No notes were generated");
      }
      
      // Update the form with generated notes
      form.setValue('notes', data.notes, { shouldValidate: true });
      toast.success("Episode notes generated successfully");
      
    } catch (error: any) {
      console.error("Error generating notes:", error);
      toast.error(`Failed to generate notes: ${error.message || "Unknown error"}`);
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <FormLabel className="flex items-center gap-2 mb-0">
              <BookText className="h-4 w-4 text-muted-foreground" />
              Episode Notes
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateNotes}
              disabled={isGeneratingNotes}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              {isGeneratingNotes ? "Researching..." : "Research Topic"}
            </Button>
          </div>
          <FormControl>
            <div className="min-h-[300px] relative mb-24">
              <ReactQuill 
                theme="snow" 
                value={field.value || ''} 
                onChange={field.onChange}
                placeholder="Enter episode notes"
                className="h-[300px]"
                style={{ height: '300px' }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
