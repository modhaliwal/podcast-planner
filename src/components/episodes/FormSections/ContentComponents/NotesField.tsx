
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { BookText, Sparkles } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Guest, ContentVersion } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAIPrompts } from '@/hooks/useAIPrompts';
import { useMarkdownParser } from '@/hooks/useMarkdownParser';
import { VersionSelector } from '@/components/guests/form-sections/VersionSelector';
import { v4 as uuidv4 } from 'uuid';

interface NotesFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests?: Guest[];
}

export function NotesField({ form, guests = [] }: NotesFieldProps) {
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [markdownToConvert, setMarkdownToConvert] = useState<string | undefined>();
  const { getPromptByKey } = useAIPrompts();
  const parsedHtml = useMarkdownParser(markdownToConvert);
  
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  const [previousContent, setPreviousContent] = useState<string>("");
  const [hasChangedSinceLastSave, setHasChangedSinceLastSave] = useState<boolean>(false);
  const [versionCreatedSinceFormOpen, setVersionCreatedSinceFormOpen] = useState<boolean>(false);
  
  const notesVersions = form.watch('notesVersions') || [];
  
  useEffect(() => {
    if (notesVersions.length === 0) {
      const currentNotes = form.getValues('notes');
      if (currentNotes && currentNotes.trim() !== '') {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentNotes,
          timestamp: new Date().toISOString(),
          source: 'import'
        };
        form.setValue('notesVersions', [initialVersion], { shouldValidate: true });
        setActiveVersionId(initialVersion.id);
        setPreviousContent(currentNotes);
      }
    } else if (!activeVersionId) {
      const sortedVersions = [...notesVersions].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActiveVersionId(sortedVersions[0].id);
      setPreviousContent(sortedVersions[0].content);
    }
  }, [notesVersions, form, activeVersionId]);
  
  useEffect(() => {
    if (parsedHtml && markdownToConvert) {
      const newVersion: ContentVersion = {
        id: uuidv4(),
        content: parsedHtml,
        timestamp: new Date().toISOString(),
        source: 'ai'
      };
      
      const updatedVersions = [...notesVersions, newVersion];
      
      form.setValue('notes', parsedHtml, { shouldValidate: true });
      form.setValue('notesVersions', updatedVersions, { shouldValidate: true });
      
      setActiveVersionId(newVersion.id);
      setPreviousContent(parsedHtml);
      setHasChangedSinceLastSave(false);
      setVersionCreatedSinceFormOpen(true);
      setMarkdownToConvert(undefined);
      
      setIsGeneratingNotes(false);
      toast.success("Episode notes generated successfully");
    }
  }, [parsedHtml, markdownToConvert, form, notesVersions]);
  
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'notes') {
        const currentValue = value.notes as string;
        if (currentValue !== previousContent) {
          setHasChangedSinceLastSave(true);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, previousContent]);
  
  const selectVersion = (version: ContentVersion) => {
    form.setValue('notes', version.content, { shouldValidate: true });
    setActiveVersionId(version.id);
    setPreviousContent(version.content);
    setHasChangedSinceLastSave(false);
  };
  
  const saveCurrentVersion = (source: ContentVersion['source'] = 'manual') => {
    const currentNotes = form.getValues('notes');
    
    if (!currentNotes || !currentNotes.trim()) return;
    
    if (currentNotes === previousContent) return;
    
    if (versionCreatedSinceFormOpen && source === 'manual') return;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: currentNotes,
      timestamp: new Date().toISOString(),
      source
    };
    
    const updatedVersions = [...notesVersions, newVersion];
    form.setValue('notesVersions', updatedVersions, { shouldValidate: true });
    setActiveVersionId(newVersion.id);
    setPreviousContent(currentNotes);
    setHasChangedSinceLastSave(false);
    
    if (source === 'manual') {
      setVersionCreatedSinceFormOpen(true);
    }
    
    return newVersion;
  };
  
  const handleClearAllVersions = () => {
    const activeVersion = notesVersions.find(v => v.id === activeVersionId);
    
    if (activeVersion) {
      form.setValue('notesVersions', [activeVersion], { shouldValidate: true });
    } else {
      const currentNotes = form.getValues('notes');
      form.setValue('notesVersions', [], { shouldValidate: true });
      
      if (currentNotes && currentNotes.trim()) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentNotes,
          timestamp: new Date().toISOString(),
          source: 'manual'
        };
        form.setValue('notesVersions', [initialVersion], { shouldValidate: true });
        setActiveVersionId(initialVersion.id);
        setPreviousContent(currentNotes);
      }
    }
    
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(false);
  };
  
  const handleEditorBlur = () => {
    if (hasChangedSinceLastSave) {
      const currentNotes = form.getValues('notes');
      
      if (currentNotes !== previousContent && currentNotes.trim() && !versionCreatedSinceFormOpen) {
        saveCurrentVersion('manual');
      }
    }
  };
  
  const handleGenerateNotes = async () => {
    const topic = form.getValues('topic');
    
    if (!topic) {
      toast.warning("Please add a topic before generating notes");
      return;
    }
    
    try {
      setIsGeneratingNotes(true);
      toast.info("Generating episode notes with research about this topic. This may take a minute...");
      
      const promptData = getPromptByKey('episode_notes_generator');
      
      if (!promptData) {
        throw new Error("Episode notes generator prompt not found");
      }
      
      console.log("Retrieved prompt data:", promptData);
      
      const prompt = promptData.prompt_text.replace('${topic}', topic);
      
      console.log("Calling generate-episode-notes function with topic:", topic);
      console.log("Using prompt:", prompt);
      
      const requestBody: any = {
        topic,
        prompt
      };
      
      if (promptData.system_prompt) {
        requestBody.systemPrompt = promptData.system_prompt;
      }
      
      if (promptData.context_instructions) {
        requestBody.contextInstructions = promptData.context_instructions;
      }
      
      if (promptData.example_output) {
        requestBody.exampleOutput = promptData.example_output;
      }
      
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
      
      setMarkdownToConvert(data.notes);
      
    } catch (error: any) {
      console.error("Error generating notes:", error);
      toast.error(`Failed to generate notes: ${error.message || "Unknown error"}`);
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
            <div className="flex space-x-2">
              <VersionSelector 
                versions={notesVersions}
                onSelectVersion={selectVersion}
                activeVersionId={activeVersionId}
                onClearAllVersions={handleClearAllVersions}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateNotes}
                disabled={isGeneratingNotes}
                className="h-8 gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isGeneratingNotes ? "Researching..." : "Research Topic"}
              </Button>
            </div>
          </div>
          <FormControl>
            <div className="min-h-[300px] relative mb-24">
              <ReactQuill 
                theme="snow" 
                value={field.value || ''} 
                onChange={field.onChange}
                onBlur={handleEditorBlur}
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
