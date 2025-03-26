
import { useState, useEffect, useCallback } from 'react';
import { ContentVersion } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';

interface UseEpisodeNotesVersionsProps {
  form: UseFormReturn<EpisodeFormValues>;
  initialVersions?: ContentVersion[];
}

export function useEpisodeNotesVersions({ 
  form, 
  initialVersions = [] 
}: UseEpisodeNotesVersionsProps) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [versions, setVersions] = useState<ContentVersion[]>(initialVersions);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  // Initialize versions if they don't exist
  useEffect(() => {
    if (!hasInitialized) {
      const currentContent = form.getValues('notes') || '';
      
      if (versions.length === 0 && currentContent) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentContent,
          timestamp: new Date().toISOString(),
          source: 'manual'
        };
        
        setVersions([initialVersion]);
        form.setValue('notesVersions', [initialVersion], { shouldDirty: false });
        setActiveVersionId(initialVersion.id);
      } else if (versions.length > 0) {
        // Set to the most recent version
        const sortedVersions = [...versions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setVersions(sortedVersions);
        setActiveVersionId(sortedVersions[0].id);
      }
      
      setHasInitialized(true);
    }
  }, [form, versions, hasInitialized]);

  const handleContentChange = useCallback(() => {
    const currentContent = form.getValues('notes') || '';
    
    if (typeof currentContent === 'string' && currentContent.trim() && activeVersionId) {
      const activeVersion = versions.find(v => v.id === activeVersionId);
      
      // Only create a new version if content has changed
      if (activeVersion && currentContent !== activeVersion.content) {
        const newVersion: ContentVersion = {
          id: uuidv4(),
          content: currentContent,
          timestamp: new Date().toISOString(),
          source: 'manual'
        };
        
        const updatedVersions = [...versions, newVersion];
        setVersions(updatedVersions);
        form.setValue('notesVersions', updatedVersions, { shouldDirty: true });
        setActiveVersionId(newVersion.id);
      }
    }
  }, [activeVersionId, versions, form]);

  const selectVersion = useCallback((version: ContentVersion) => {
    form.setValue('notes', version.content, { shouldDirty: false });
    setActiveVersionId(version.id);
  }, [form]);

  const clearAllVersions = useCallback(() => {
    const currentContent = form.getValues('notes') || '';
    
    // Create a single version with current content
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: typeof currentContent === 'string' ? currentContent : '',
      timestamp: new Date().toISOString(),
      source: 'manual'
    };
    
    setVersions([newVersion]);
    form.setValue('notesVersions', [newVersion], { shouldDirty: false });
    setActiveVersionId(newVersion.id);
  }, [form]);

  const addNewVersion = useCallback((content: string, source: "manual" | "ai" | "import" = "manual") => {
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      source
    };
    
    const updatedVersions = [...versions, newVersion];
    setVersions(updatedVersions);
    form.setValue('notesVersions', updatedVersions, { shouldDirty: true });
    setActiveVersionId(newVersion.id);
    
    return newVersion;
  }, [versions, form]);

  // For version selector dropdown - memoized to prevent re-renders
  const versionSelectorProps = {
    versions,
    onSelectVersion: selectVersion,
    activeVersionId: activeVersionId || undefined,
    onClearAllVersions: clearAllVersions
  };

  return {
    activeVersionId,
    versions,
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion,
    versionSelectorProps
  };
}
