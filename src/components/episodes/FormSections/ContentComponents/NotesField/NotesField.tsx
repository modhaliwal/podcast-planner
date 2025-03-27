
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../../EpisodeFormSchema';
import { FileText } from 'lucide-react';
import { Guest, ContentVersion } from '@/lib/types';
import { NotesVersionManager } from './NotesVersionManager';

interface NotesFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function NotesField({ form, guests }: NotesFieldProps) {
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
            <NotesVersionManager 
              form={form}
              guests={guests}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
