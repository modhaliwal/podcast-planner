
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { Editor } from '@/components/editor/Editor';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { Guest } from '@/lib/types';
import { useVersionManager } from '@/hooks/versions';
import { NotesGeneration } from './NotesGeneration';

interface NotesFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function NotesField({ form, guests }: NotesFieldProps) {
  const [content, setContent] = useState(form.watch('notes') || '');
  
  // Initialize versions manager
  const { 
    versions, 
    handleContentChange,
    handleEditorBlur,
    isLatestVersionActive,
    activeVersion
  } = useVersionManager({
    initialContent: content,
    initialVersions: form.watch('notesVersions') || [],
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
    handleContentChange(value);
  };
  
  // Handle saving content (which also creates a new version)
  const handleSave = (content: string) => {
    form.setValue('notes', content);
    form.setValue('notesVersions', versions);
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
              onNotesGenerated={handleChange}
              form={form}
            />
          </div>
        </FormItem>
      )}
    />
  );
}
