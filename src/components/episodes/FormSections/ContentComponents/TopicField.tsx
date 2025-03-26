
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { Tag } from 'lucide-react';

interface TopicFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function TopicField({ form }: TopicFieldProps) {
  return (
    <FormField
      control={form.control}
      name="topic"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            Topic
          </FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter episode topic" 
              className="resize-y"
              {...field} 
              value={field.value || ''}
              onChange={(e) => {
                console.log("Topic field changed:", e.target.value);
                field.onChange(e.target.value);
              }}
            />
          </FormControl>
          <FormDescription>
            Provide a short phrase or sentence including any specific keywords relevant to industry, field or ideas to be discussed in this episode.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
