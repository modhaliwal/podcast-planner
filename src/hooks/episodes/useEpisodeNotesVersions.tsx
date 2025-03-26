
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
          active: true,
          versionNumber: 1
        };
        
        setVersions([initialVersion]);
        form.setValue('notesVersions', [initialVersion], { shouldDirty: false });
        setActiveVersionId(initialVersion.id);
      } else if (versions.length > 0) {
        // Ensure all versions have version numbers
        const versionsWithNumbers = versions.map((version, index) => ({
          ...version,
          versionNumber: version.versionNumber || index + 1,
          active: version.active || false
        }));
        
        // Set to the most recent version
        const sortedVersions = [...versionsWithNumbers].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Find the active version or use the most recent one
        const activeVersion = versionsWithNumbers.find(v => v.active === true) || sortedVersions[0];
        
        // Update all versions to set the active one
        const updatedVersions = versionsWithNumbers.map(v => ({
          ...v,
          active: v.id === activeVersion.id
        }));
        
        setVersions(updatedVersions);
        setActiveVersionId(activeVersion.id);
        
        // Update form with current content and versions
        form.setValue('notes', activeVersion.content, { shouldDirty: false });
        form.setValue('notesVersions', updatedVersions, { shouldDirty: false });
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
          active: true,
          versionNumber: nextVersionNumber
        };
        
        // Remove active flag from other versions
        const updatedVersions = versions.map(v => ({
          ...v,
          active: false
        }));
        
        const finalVersions = [...updatedVersions, newVersion];
        setVersions(finalVersions);
        form.setValue('notesVersions', finalVersions, { shouldDirty: true });
        setActiveVersionId(newVersion.id);
      }
    }
  }, [activeVersionId, versions, form]);

  const selectVersion = useCallback((version: ContentVersion) => {
    // Update form with selected version content
    form.setValue('notes', version.content, { shouldDirty: false });
    
    // Update all versions to mark the selected one as active
    const updatedVersions = versions.map(v => ({
      ...v,
      active: v.id === version.id
    }));
    
    setVersions(updatedVersions);
    form.setValue('notesVersions', updatedVersions, { shouldDirty: true });
    setActiveVersionId(version.id);
  }, [form, versions]);

  const clearAllVersions = useCallback(() => {
    const currentContent = form.getValues('notes') || '';
    
    // Create a single version with current content
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: typeof currentContent === 'string' ? currentContent : '',
      timestamp: new Date().toISOString(),
      source: 'manual',
      active: true,
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
      active: true,
      versionNumber: nextVersionNumber
    };
    
    // Remove active flag from other versions
    const updatedVersions = versions.map(v => ({
      ...v,
      active: false
    }));
    
    const finalVersions = [...updatedVersions, newVersion];
    setVersions(finalVersions);
    form.setValue('notesVersions', finalVersions, { shouldDirty: true });
    form.setValue('notes', content, { shouldDirty: true });
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
