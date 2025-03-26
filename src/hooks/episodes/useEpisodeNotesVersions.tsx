
import { ContentVersion } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';
import { useVersionManager } from '@/hooks/versions/useVersionManager';

interface UseEpisodeNotesVersionsProps {
  form: UseFormReturn<EpisodeFormValues>;
  initialVersions?: ContentVersion[];
}

export function useEpisodeNotesVersions({ 
  form, 
  initialVersions = [] 
}: UseEpisodeNotesVersionsProps) {
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

  return versionManager;
}
