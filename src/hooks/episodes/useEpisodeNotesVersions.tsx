
import { ContentVersion } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';
import { useVersionManager } from '@/hooks/versions/useVersionManager';
import { useEffect, useState } from 'react';

interface UseEpisodeNotesVersionsProps {
  form: UseFormReturn<EpisodeFormValues>;
  initialVersions?: ContentVersion[];
}

export function useEpisodeNotesVersions({ 
  form, 
  initialVersions = [] 
}: UseEpisodeNotesVersionsProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const content = form.getValues('notes') || '';
  
  // Use the consolidated version manager
  const versionManager = useVersionManager({
    content,
    versions: initialVersions,
    onVersionsChange: (versions) => {
      form.setValue('notesVersions', versions, { shouldDirty: true });
    },
    onContentChange: (content) => {
      form.setValue('notes', content, { shouldDirty: true });
    }
  });

  // Ensure we properly initialize with form data once
  useEffect(() => {
    if (!isInitialized) {
      const formVersions = form.getValues('notesVersions') || [];
      const formContent = form.getValues('notes') || '';
      
      // Only initialize if we have versions from the form
      if (formVersions.length > 0) {
        // Find the active version
        const activeVersion = formVersions.find(v => v.active);
        if (activeVersion) {
          // Select the active version to ensure we're using the right content
          versionManager.selectVersion(activeVersion);
        }
      }
      
      setIsInitialized(true);
    }
  }, [form, isInitialized, versionManager]);

  return versionManager;
}
