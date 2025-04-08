import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
interface ContactSectionProps {
  form: UseFormReturn<any>;
}
export function ContactSection({
  form
}: ContactSectionProps) {
  return <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-medium mb-3 sm:mb-4">Contact Information</h3>
      <div className="space-y-3 sm:space-y-4">
        <FormField control={form.control} name="email" render={({
        field
      }) => <FormItem>
              
              <FormControl>
                <Input type="email" placeholder="Enter guest email address" {...field} />
              </FormControl>
              <FormDescription className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" />
                Primary email address for contacting the guest
              </FormDescription>
              <FormMessage />
            </FormItem>} />
        
        <FormField control={form.control} name="phone" render={({
        field
      }) => <FormItem>
              
              <FormControl>
                <Input type="tel" placeholder="Enter guest phone number" {...field} />
              </FormControl>
              <FormDescription className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" />
                Contact number for booking coordination
              </FormDescription>
              <FormMessage />
            </FormItem>} />
      </div>
    </Card>;
}