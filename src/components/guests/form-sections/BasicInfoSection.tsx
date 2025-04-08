import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}
export function BasicInfoSection({
  form
}: BasicInfoSectionProps) {
  return <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Basic Information</h3>
      <div className="space-y-4">
        <FormField control={form.control} name="name" render={({
        field
      }) => <FormItem>
              
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        
        <FormField control={form.control} name="title" render={({
        field
      }) => <FormItem>
              
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        
        <FormField control={form.control} name="company" render={({
        field
      }) => <FormItem>
              
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        
        <FormField control={form.control} name="status" render={({
        field
      }) => <FormItem>
              
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
              <FormMessage />
            </FormItem>} />
      </div>
    </Card>;
}