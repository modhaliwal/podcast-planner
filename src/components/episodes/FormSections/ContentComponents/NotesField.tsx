
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

interface NotesFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests?: Guest[];
}

export function NotesField({ form, guests = [] }: NotesFieldProps) {
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  
  const handleGenerateNotes = async () => {
    const topic = form.getValues('topic');
    
    // Validation check for topic only
    if (!topic) {
      toast.warning("Please add a topic before generating notes");
      return;
    }
    
    try {
      setIsGeneratingNotes(true);
      toast.info("Generating episode notes. This may take a minute...");
      
      // Call the Supabase function to generate notes
      const { data, error } = await supabase.functions.invoke('generate-episode-notes', {
        body: {
          topic
        }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to generate notes");
      }
      
      if (!data?.notes) {
        throw new Error("No notes were generated");
      }
      
      // Update the form with generated notes
      form.setValue('notes', data.notes, { shouldValidate: true });
      toast.success("Episode notes generated successfully");
      
    } catch (error) {
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
        <FormItem>
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
              {isGeneratingNotes ? "Generating..." : "Generate Notes"}
            </Button>
          </div>
          <FormControl>
            <div className="min-h-[200px]">
              <ReactQuill 
                theme="snow" 
                value={field.value || ''} 
                onChange={field.onChange}
                placeholder="Enter episode notes"
                className="h-[200px] mb-12"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
