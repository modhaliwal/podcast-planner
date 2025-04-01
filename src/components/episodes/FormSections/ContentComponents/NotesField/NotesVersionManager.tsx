
import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../../EpisodeFormSchema';
import { Guest, ContentVersion } from '@/lib/types';
import { processVersions } from '@/lib/versionUtils';
import { VersionManager } from '@/components/episodes/VersionManager';
import { NotesFieldHeader } from './NotesFieldHeader';
import { Editor } from '@/components/editor/Editor';
import { toast } from '@/hooks/toast';

interface NotesVersionManagerProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function NotesVersionManager({ form, guests }: NotesVersionManagerProps) {
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
          <NotesFieldHeader 
            form={form}
            guests={guests}
            versions={formattedVersions()}
            versionSelectorProps={versionSelectorProps}
            onNotesGenerated={(generatedNotes) => {
              handleContentUpdate(generatedNotes);
              addAIVersion(generatedNotes);
              toast.success("AI-generated notes added");
            }}
          />
          
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
  );
}
