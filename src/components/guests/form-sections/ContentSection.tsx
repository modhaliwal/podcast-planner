
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
  // Watch the notes field to pass it to generators
  const notes = form.watch('notes') || '';
  
  // Format guest data for use in AI generation similar to the episode ContentSection
  const formatGuestData = (guest?: Guest): string => {
    if (!guest) return "No guest data available.";
    
    return [
      `Name: ${guest.name || "Unnamed Guest"}`,
      guest.title ? `Title: ${guest.title}` : '',
      guest.company ? `Company: ${guest.company}` : '',
      `Bio: ${guest.bio || "No bio available."}`
    ]
    .filter(Boolean) // Remove empty lines
    .join('\n');
  };

  const guest_info = formatGuestData(guest);

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
      <BackgroundResearchSection 
        form={form} 
        guest={guest} 
        notes={notes}
      />

      {/* Bio Section */}
      <BioSection 
        form={form} 
        guest={guest} 
        notes={notes}
      />
    </div>
  );
}
