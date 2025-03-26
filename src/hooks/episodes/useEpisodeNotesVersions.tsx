
import { useState, useEffect, useCallback } from 'react';
import { ContentVersion } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';

interface UseEpisodeNotesVersionsProps {
  form: UseFormReturn<EpisodeFormValues>;
  initialVersions?: ContentVersion[];
}

/**
 * Find the highest version number in an array of content versions
 */
const findHighestVersionNumber = (versions: ContentVersion[]): number => {
  if (!versions.length) return 0;
  return Math.max(...versions.map(v => v.versionNumber || 0));
};

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
          source: 'manual',
          versionNumber: 1
        };
        
        setVersions([initialVersion]);
        form.setValue('notesVersions', [initialVersion], { shouldDirty: false });
        setActiveVersionId(initialVersion.id);
      } else if (versions.length > 0) {
        // Ensure all versions have version numbers
        const versionsWithNumbers = versions.map((version, index) => ({
          ...version,
          versionNumber: version.versionNumber || index + 1
        }));
        
        // Set to the most recent version
        const sortedVersions = [...versionsWithNumbers].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setVersions(sortedVersions);
        setActiveVersionId(sortedVersions[0].id);
        
        // If we updated versions with numbers, update the form value
        if (JSON.stringify(versions) !== JSON.stringify(versionsWithNumbers)) {
          form.setValue('notesVersions', versionsWithNumbers, { shouldDirty: false });
        }
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
        // Calculate next version number
        const nextVersionNumber = findHighestVersionNumber(versions) + 1;
        
        const newVersion: ContentVersion = {
          id: uuidv4(),
          content: currentContent,
          timestamp: new Date().toISOString(),
          source: 'manual',
          versionNumber: nextVersionNumber
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
      source: 'manual',
      versionNumber: 1
    };
    
    setVersions([newVersion]);
    form.setValue('notesVersions', [newVersion], { shouldDirty: false });
    setActiveVersionId(newVersion.id);
  }, [form]);

  const addNewVersion = useCallback((content: string, source: "manual" | "ai" | "import" = "manual") => {
    // Calculate next version number
    const nextVersionNumber = findHighestVersionNumber(versions) + 1;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      source,
      versionNumber: nextVersionNumber
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
