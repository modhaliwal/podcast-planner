
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";

interface BioSectionProps {
  form: UseFormReturn<any>;
}

export function BioSection({ form }: BioSectionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Bio</h3>
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea 
                {...field} 
                className="min-h-[300px] resize-y" 
                placeholder="Enter guest bio here..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
}
