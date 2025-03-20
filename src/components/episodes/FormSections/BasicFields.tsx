
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PenLine, Hash, Activity } from 'lucide-react';
import { EpisodeStatus } from '@/lib/enums';

interface BasicFieldsProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function BasicFields({ form }: BasicFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-muted-foreground" />
              Episode Title
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter episode title" {...field} />
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
            <FormLabel className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              Episode Number
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter episode number" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Status
            </FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select episode status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={EpisodeStatus.SCHEDULED}>{EpisodeStatus.SCHEDULED}</SelectItem>
                <SelectItem value={EpisodeStatus.RECORDED}>{EpisodeStatus.RECORDED}</SelectItem>
                <SelectItem value={EpisodeStatus.PUBLISHED}>{EpisodeStatus.PUBLISHED}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
