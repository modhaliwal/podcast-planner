
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../../EpisodeFormSchema';
import { Guest, ContentVersion } from '@/lib/types';
import { NotesGeneration } from '../NotesGeneration';
import { VersionSelector } from '@/components/episodes/VersionSelector';

interface NotesFieldHeaderProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
  versions: ContentVersion[];
  versionSelectorProps: any;
  onNotesGenerated: (notes: string) => void;
}

export function NotesFieldHeader({ 
  form, 
  guests, 
  versions, 
  versionSelectorProps,
  onNotesGenerated 
}: NotesFieldHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div></div>
      <div className="flex items-center gap-2">
        {versions.length > 0 && (
          <div className="z-10">
            <VersionSelector {...versionSelectorProps} />
          </div>
        )}
        <NotesGeneration 
          guests={guests}
          onNotesGenerated={onNotesGenerated}
          form={form}
        />
      </div>
    </div>
  );
}
