
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { Editor } from '@/components/editor/Editor';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { Guest, ContentVersion } from '@/lib/types';
import { useVersionManager } from '@/hooks/versions';
import { NotesGeneration } from './NotesGeneration';
import { toast } from '@/hooks/toast';
import { ensureVersionNumbers } from '@/hooks/versions';
import { v4 as uuidv4 } from 'uuid';

interface NotesFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function NotesField({ form, guests }: NotesFieldProps) {
  const [content, setContent] = useState(form.watch('notes') || '');
  
  // Make sure versions are properly formatted with required properties
  const initialVersions = form.watch('notesVersions') || [];
  
  // Ensure all versions have required properties before passing to useVersionManager
  // Create formatted versions with all required fields explicitly set
  const formattedVersions = initialVersions.map((version: any) => ({
    id: version.id || uuidv4(), // Ensure id is always present
    content: version.content || '',
    timestamp: version.timestamp || new Date().toISOString(),
    source: version.source || 'manual',
    active: version.active || false,
    versionNumber: version.versionNumber || 1
  })) as ContentVersion[];
  
  // Initialize versions manager
  const { 
    versions, 
    handleContentChange,
    handleEditorBlur,
    isLatestVersionActive,
    activeVersion
  } = useVersionManager({
    content: content,
    versions: formattedVersions,
    onContentChange: (newContent) => {
      setContent(newContent);
      form.setValue('notes', newContent);
    },
    onVersionsChange: (updatedVersions) => {
      form.setValue('notesVersions', updatedVersions);
    }
  });
  
  // Update form values when content changes
  const handleChange = (value: string) => {
    setContent(value);
    handleContentChange();
  };
  
  // Handle saving content (which also creates a new version)
  const handleSave = () => {
    form.setValue('notes', content);
    form.setValue('notesVersions', versions);
    toast({
      title: "Success",
      description: "Notes saved successfully",
    });
  };

  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Episode Notes
          </FormLabel>
          <FormControl>
            <div className="rounded-md border">
              <Editor
                value={content}
                onChange={handleChange}
                placeholder="Enter episode notes..."
              />
            </div>
          </FormControl>
          <FormMessage />
          
          <div className="mt-4">
            <NotesGeneration 
              guests={guests}
              onNotesGenerated={(generatedNotes) => {
                handleChange(generatedNotes);
                toast({
                  title: "Success",
                  description: "AI-generated notes added",
                });
              }}
              form={form}
            />
          </div>
        </FormItem>
      )}
    />
  );
}
