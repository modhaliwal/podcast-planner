
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { BookText, PenLine, Tag, Info, FileText } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Guest, ContentVersion } from '@/lib/types';
import { Editor } from '@/components/editor/Editor';
import { useState, useEffect, useCallback } from 'react';
import { processVersions } from '@/lib/versionUtils';
import { v4 as uuidv4 } from 'uuid';
import { ContentGenerator } from "@/components/content/ContentGenerator";
import { ContentGenerationConfig } from "@/components/content/types";
import { ensureVersionNumbers } from '@/hooks/versions';
import { toast } from '@/hooks/toast';

interface ContentSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function ContentSection({ form, guests = [] }: ContentSectionProps) {
  // Notes handling (formerly in NotesVersionManager)
  const [content, setContent] = useState(form.watch('notes') || '');
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  
  // Initialize versions from form
  useEffect(() => {
    const rawVersions = form.watch('notesVersions') || [];
    const formattedVersions = processVersions(rawVersions as ContentVersion[]);
    setVersions(formattedVersions);
  }, [form]);
  
  // Update content when form value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'notes') {
        setContent(value.notes || '');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Create a new version
  const addNewVersion = useCallback((newContent: string, source: string = 'manual') => {
    const timestamp = new Date().toISOString();
    const newVersionId = uuidv4();
    
    // Create new version
    const newVersion: ContentVersion = {
      id: newVersionId,
      content: newContent,
      timestamp,
      source,
      active: true,
      versionNumber: versions.length + 1
    };
    
    // Add the new version and mark it as active
    const updatedVersions = ensureVersionNumbers([
      ...versions.map(v => ({ ...v, active: false })),
      newVersion
    ]);
    
    setVersions(updatedVersions);
    form.setValue('notesVersions', updatedVersions, { shouldDirty: true });
  }, [versions, form]);
  
  // Handle editor blur - save version if content changed
  const handleEditorBlur = useCallback(() => {
    const activeVersion = versions.find(v => v.active);
    
    // Only create a new version if content has been changed and we have a previous version
    if (versions.length > 0 && activeVersion && content !== activeVersion.content) {
      addNewVersion(content);
    }
  }, [content, versions, addNewVersion]);

  // Handle notes generation (formerly in NotesGeneration component)
  const handleNotesGenerated = (generatedNotes: string) => {
    setContent(generatedNotes);
    form.setValue('notes', generatedNotes, { shouldDirty: true });
    addNewVersion(generatedNotes, 'ai');
    toast.success("AI-generated notes added");
  };

  // Notes generation configuration (inlined from NotesGeneration component)
  const getNotesGenerationConfig = () => {
    const selectedGuestIds = form.watch('guestIds') || [];
    const topic = form.watch('topic') || '';
    
    // Find selected guests from the full guests array
    const selectedGuests = guests.filter(g => selectedGuestIds.includes(g.id));
    
    // Create the content generation config
    const config: ContentGenerationConfig = {
      fieldName: "notes",
      promptKey: "episode_notes",
      buttonLabel: "Generate Notes",
      loadingLabel: "Generating notes...",
      onContentGenerated: handleNotesGenerated,
      guests: selectedGuests,
      additionalContext: {
        episode: {
          title: form.watch('title') || '',
          topic: topic,
        },
        topic
      },
      edgeFunctionName: 'generate-episode-notes',
      generationType: "notes",
      preferredProvider: "perplexity" // Explicitly set to use Perplexity
    };
    
    return config;
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookText className="h-5 w-5 text-primary" />
          Episode Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        {/* Topic Field (inlined) */}
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
        
        {/* Notes Field (inlined) */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Notes
              </FormLabel>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div></div>
                  <div className="flex items-center gap-2">
                    <ContentGenerator config={getNotesGenerationConfig()} form={form} />
                  </div>
                </div>
                
                <FormControl>
                  <Editor
                    value={content}
                    onChange={(value) => {
                      setContent(value);
                      form.setValue('notes', value, { shouldDirty: true });
                    }}
                    onBlur={handleEditorBlur}
                    placeholder="Add episode notes here..."
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Introduction Field (inlined) */}
        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem className="pt-8">
              <FormLabel className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Introduction
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter episode introduction" 
                  className="min-h-[150px] resize-y"
                  {...field} 
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
