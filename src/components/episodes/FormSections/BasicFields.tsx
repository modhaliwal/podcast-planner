
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Textarea } from "@/components/ui/textarea";
import { memo } from "react";

interface BasicFieldsProps {
  form: UseFormReturn<EpisodeFormValues>;
}

// Memoize the component to prevent unnecessary re-renders
export const BasicFields = memo(function BasicFields({ form }: BasicFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Episode Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="episodeNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Episode Number</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topic</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Enter episode topic..."
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});
