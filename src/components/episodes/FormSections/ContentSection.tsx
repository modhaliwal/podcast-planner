
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { BookText, Info, Tag, Sparkles } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { Guest } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface ContentSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests?: Guest[];
}

export function ContentSection({ form, guests = [] }: ContentSectionProps) {
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  
  const handleGenerateNotes = async () => {
    const topic = form.getValues('topic');
    const guestIds = form.getValues('guestIds');
    
    // Validation checks
    if (!topic) {
      toast.warning("Please add a topic before generating notes");
      return;
    }
    
    if (guestIds.length === 0) {
      toast.warning("Please select at least one guest before generating notes");
      return;
    }
    
    try {
      setIsGeneratingNotes(true);
      toast.info("Generating episode notes. This may take a minute...");
      
      // Find selected guests
      const selectedGuests = guests.filter(guest => guestIds.includes(guest.id));
      
      if (selectedGuests.length === 0) {
        throw new Error("Selected guests not found");
      }
      
      // Prepare guest bios for the request
      const guestBios = selectedGuests.map(guest => ({
        name: guest.name,
        bio: guest.bio
      }));
      
      // Call the Supabase function to generate notes
      const { data, error } = await supabase.functions.invoke('generate-episode-notes', {
        body: {
          topic,
          guestBios
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
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookText className="h-5 w-5 text-primary" />
          Episode Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Topic
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter episode topic" 
                  className="resize-y"
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Provide a short phrase or sentence including any specific keywords relevant to industry, field or ideas to be discussed in this episode.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Introduction
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter episode introduction" 
                  className="min-h-[120px] resize-y"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
      </CardContent>
    </Card>
  );
}
