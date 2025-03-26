
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ContentVersion } from "@/lib/types";

interface BioEditorProps {
  form: UseFormReturn<any>;
  activeVersionId: string | undefined;
  onBioChange: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export function BioEditor({ form, activeVersionId, onBioChange }: BioEditorProps) {
  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea 
              {...field} 
              rows={8}
              placeholder="Guest biography" 
              required
              onBlur={onBioChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
