
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ContentSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function ContentSection({ form }: ContentSectionProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Episode Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Introduction</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter episode introduction" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Episode Notes</FormLabel>
              <FormControl>
                <div className="min-h-[200px]">
                  <ReactQuill 
                    theme="snow" 
                    value={field.value || ''} 
                    onChange={field.onChange}
                    placeholder="Enter episode notes"
                    className="h-[200px] mb-12"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
