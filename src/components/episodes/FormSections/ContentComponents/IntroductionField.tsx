
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { Info } from 'lucide-react';

interface IntroductionFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function IntroductionField({ form }: IntroductionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="introduction"
      render={({ field }) => (
        <FormItem className="pt-4">
          <FormLabel className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Introduction
          </FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter episode introduction" 
              className="min-h-[150px] resize-y"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
