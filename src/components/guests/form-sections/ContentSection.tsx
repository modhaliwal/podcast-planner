
import { UseFormReturn } from 'react-hook-form';
import { Guest } from '@/lib/types';
import { BioSection } from './bio';
import { BackgroundResearchSection } from './background-research';
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ContentSectionProps {
  form: UseFormReturn<any>;
  guest?: Guest;
}

export function ContentSection({ form, guest }: ContentSectionProps) {
  return (
    <div className="space-y-6">
      {/* Notes Section */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Notes</h3>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Add private notes about this guest..."
                  className="min-h-[200px] resize-y"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Card>

      {/* Research Section */}
      <BackgroundResearchSection form={form} guest={guest} />

      {/* Bio Section */}
      <BioSection form={form} guest={guest} />
    </div>
  );
}
