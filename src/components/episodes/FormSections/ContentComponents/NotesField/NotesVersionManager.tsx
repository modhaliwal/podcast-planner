
import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../../EpisodeFormSchema';
import { Guest, ContentVersion } from '@/lib/types';
import { processVersions } from '@/lib/versionUtils';
import { NotesFieldHeader } from './NotesFieldHeader';
import { Editor } from '@/components/editor/Editor';
import { toast } from '@/hooks/toast';
import { v4 as uuidv4 } from 'uuid';
import { ensureVersionNumbers } from '@/hooks/versions';

interface NotesVersionManagerProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function NotesVersionManager({ form, guests }: NotesVersionManagerProps) {
  // Get the current notes content
  const [content, setContent] = useState(form.watch('notes') || '');
  
  // Track versions
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
  
  return (
    <div className="space-y-4">
      <NotesFieldHeader 
        form={form}
        guests={guests}
        versions={versions}
        onNotesGenerated={(generatedNotes) => {
          setContent(generatedNotes);
          form.setValue('notes', generatedNotes, { shouldDirty: true });
          addNewVersion(generatedNotes, 'ai');
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
  );
}
