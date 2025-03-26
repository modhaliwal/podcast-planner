
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Guest } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';

interface GuestSelectorProps {
  form: UseFormReturn<EpisodeFormValues>;
  availableGuests: Guest[];
}

export function GuestSelector({ form, availableGuests }: GuestSelectorProps) {
  const field = form.getValues('guestIds');
  
  const handleValueChange = (value: string) => {
    if (value === "all") {
      form.setValue('guestIds', availableGuests.map(guest => guest.id), { shouldValidate: true });
    } else {
      const currentValues = [...field || []];
      
      // Add or remove the value
      const valueIndex = currentValues.indexOf(value);
      if (valueIndex === -1) {
        // Add value if not already selected
        currentValues.push(value);
      } else {
        // Remove value if already selected
        currentValues.splice(valueIndex, 1);
      }
      
      form.setValue('guestIds', currentValues, { shouldValidate: true });
    }
  };

  return (
    <FormItem>
      <FormLabel>Select Guests</FormLabel>
      <Select onValueChange={handleValueChange}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select guests">
              {field?.length === 1 
                ? availableGuests.find(g => g.id === field![0])?.name 
                : `${field?.length || 0} guests selected`}
            </SelectValue>
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {availableGuests.map((guest) => (
            <SelectItem 
              key={guest.id} 
              value={guest.id}
              className={cn(
                "flex items-center",
                field?.includes(guest.id) && "bg-secondary"
              )}
            >
              <div className="flex items-center">
                {field?.includes(guest.id) && (
                  <span className="mr-2">✓</span>
                )}
                {guest.name}
              </div>
            </SelectItem>
          ))}
          <SelectItem value="all">Select All Guests</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
