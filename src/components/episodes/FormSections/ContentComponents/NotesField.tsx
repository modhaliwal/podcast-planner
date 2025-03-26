
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { Editor } from '@/components/editor/Editor';
import { FileText } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Guest, ContentVersion } from '@/lib/types';
import { VersionManager } from '@/components/guests/form-sections/VersionManager';
import { NotesGeneration } from './NotesGeneration';
import { VersionSelector } from '@/components/guests/form-sections/VersionSelector';
import { toast } from '@/hooks/toast';
import { processVersions } from '@/lib/versionUtils';

interface NotesFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function NotesField({ form, guests }: NotesFieldProps) {
  // Get the current notes content
  const [content, setContent] = useState(form.watch('notes') || '');
  
  // Get versions safely, ensuring it's an array
  const rawVersions = form.watch('notesVersions') || [];
  
  // Process versions to ensure they have all required properties
  const formattedVersions = useCallback(() => {
    const versions = Array.isArray(rawVersions) ? rawVersions : [];
    return processVersions(versions as ContentVersion[]);
  }, [rawVersions]);
  
  // Update form when content changes outside the VersionManager
  const handleContentUpdate = (newContent: string) => {
    setContent(newContent);
    form.setValue('notes', newContent, { shouldDirty: true });
  };

  // Update form versions when versions change
  const handleVersionsChange = (newVersions: ContentVersion[]) => {
    console.log("Updating form notesVersions:", newVersions);
    form.setValue('notesVersions', newVersions, { shouldDirty: true });
  };
  
  // Sync content when form value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'notes') {
        setContent(value.notes || '');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Debug log for versions
  useEffect(() => {
    console.log("NotesField versions:", {
      rawVersions,
      processedVersions: formattedVersions()
    });
  }, [rawVersions, formattedVersions]);
  
  return (
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
            <VersionManager 
              content={content}
              versions={formattedVersions()}
              onVersionsChange={handleVersionsChange}
              onContentChange={handleContentUpdate}
              source="manual"
            >
              {({ 
                activeVersionId,
                handleEditorBlur,
                handleContentChange,
                selectVersion,
                addNewVersion,
                addAIVersion,
                clearAllVersions,
                versionSelectorProps,
                hasInitialized
              }) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div></div>
                    <div className="flex items-center gap-2">
                      {formattedVersions().length > 0 && (
                        <div className="z-10">
                          <VersionSelector {...versionSelectorProps} />
                        </div>
                      )}
                      <NotesGeneration 
                        guests={guests}
                        onNotesGenerated={(generatedNotes) => {
                          handleContentUpdate(generatedNotes);
                          addAIVersion(generatedNotes);
                          toast.success("AI-generated notes added");
                        }}
                        form={form}
                      />
                    </div>
                  </div>
                  
                  <Editor
                    value={content}
                    onChange={(value) => {
                      setContent(value);
                      form.setValue('notes', value, { shouldDirty: true });
                    }}
                    onBlur={handleEditorBlur}
                    placeholder="Add episode notes here..."
                  />
                </div>
              )}
            </VersionManager>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
