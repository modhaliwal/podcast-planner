
import { FormField, FormItem, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";

interface BasicContactSectionProps {
  form: UseFormReturn<any>;
}

export function BasicContactSection({
  form
}: BasicContactSectionProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-medium mb-3 sm:mb-4">Guest Information</h3>
      <div className="space-y-3 sm:space-y-4">
        {/* Basic Information Fields */}
        <FormField 
          control={form.control} 
          name="name" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter guest name" {...field} />
              </FormControl>
              <FormDescription className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" /> 
                Enter the guest's full name as it should appear
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="title" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter guest title" {...field} />
              </FormControl>
              <FormDescription className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" />
                Professional title or position (e.g., CEO, Author)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="company" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormDescription className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" />
                Organization or company the guest is affiliated with
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />

        {/* Contact Information Fields */}
        <FormField 
          control={form.control} 
          name="email" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Enter guest email address" {...field} />
              </FormControl>
              <FormDescription className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" />
                Primary email address for contacting the guest
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="phone" 
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="tel" placeholder="Enter guest phone number" {...field} />
              </FormControl>
              <FormDescription className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" />
                Contact number for booking coordination
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        {/* Status Field from Basic Info */}
        <FormField 
          control={form.control} 
          name="status" 
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="potential">Potential</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="appeared">Appeared</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" />
                Current stage in the guest booking process
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
      </div>
    </Card>
  );
}
