
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EpisodeFormValues } from '@/hooks/episodes/useEpisodeForm';
import { BookText, Tag, Info, FileText } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Guest } from '@/lib/types';
import { AIGenerationField } from '@/components/shared/AIGenerationField';

interface ContentSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function ContentSection({ form, guests = [] }: ContentSectionProps) {
  // Get the current topic value for use in AI generation
  const topic = form.watch('topic') || '';
  const selectedGuestIds = form.watch('guestIds') || [];
  const notes = form.watch('notes') || '';
  
  // Find selected guests from the full guests array
  const selectedGuests = guests.filter(g => selectedGuestIds.includes(g.id));
  
  return (
    <Card className="md:col-span-2">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
        <CardTitle className="flex items-center gap-2">
          <BookText className="h-5 w-5 text-primary" />
          Episode Content
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-2 sm:pt-4 space-y-8 sm:space-y-12">
        {/* Topic Field */}
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
                />
              </FormControl>
              <FormDescription>
                Provide a short phrase or sentence including any specific keywords relevant to industry, field or ideas to be discussed in this episode.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Notes Field - Using AIGenerationField */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Notes
              </FormLabel>
              <FormControl>
                <AIGenerationField
                  formField="notes"
                  versionsField="notesVersions"
                  buttonLabel="Generate Notes"
                  loadingLabel="Generating notes..."
                  editorPlaceholder="Add episode notes here..."
                  generatorSlug="episode-notes-generator"
                  generationParameters={{
                    topic,
                    guests: selectedGuests,
                    episode: {
                      title: form.watch('title') || '',
                      topic
                    }
                  }}
                  hoverCardConfig={{
                    promptTitle: "Episode Notes Generator",
                    generatorSlug: "episode-notes-generator"
                  }}
                  contentName="Episode Notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Introduction Field - Using AIGenerationField */}
        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem className="pt-4 sm:pt-8">
              <FormLabel className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Introduction
              </FormLabel>
              <FormControl>
                <AIGenerationField
                  formField="introduction"
                  versionsField="introductionVersions"
                  buttonLabel="Generate Introduction"
                  loadingLabel="Generating introduction..."
                  editorPlaceholder="Enter episode introduction"
                  editorType="plain"
                  generatorSlug="episode-intro-writer"
                  generationParameters={{
                    notes,
                    topic,
                    guests: selectedGuests,
                    episode: {
                      title: form.watch('title') || '',
                      topic
                    }
                  }}
                  hoverCardConfig={{
                    promptTitle: "Episode Introduction Generator",
                    generatorSlug: "episode-intro-writer"
                  }}
                  contentName="Episode Introduction"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
