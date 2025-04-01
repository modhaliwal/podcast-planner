
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../../EpisodeFormSchema';
import { Guest, ContentVersion } from '@/lib/types';
import { NotesGeneration } from '../NotesGeneration';

interface NotesFieldHeaderProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
  versions: ContentVersion[];
  onNotesGenerated: (notes: string) => void;
}

export function NotesFieldHeader({ 
  form, 
  guests, 
  versions, 
  onNotesGenerated 
}: NotesFieldHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div></div>
      <div className="flex items-center gap-2">
        <NotesGeneration 
          guests={guests}
          onNotesGenerated={onNotesGenerated}
          form={form}
        />
      </div>
    </div>
  );
}
