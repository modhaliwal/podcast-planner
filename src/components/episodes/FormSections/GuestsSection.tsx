
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Guest } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GuestsSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function GuestsSection({ form, guests }: GuestsSectionProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Guests</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="guestIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Guests</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === "all") {
                    field.onChange(guests.map(guest => guest.id));
                  } else {
                    const currentValues = [...field.value || []];
                    
                    // Add or remove the value
                    const valueIndex = currentValues.indexOf(value);
                    if (valueIndex === -1) {
                      // Add value if not already selected
                      currentValues.push(value);
                    } else {
                      // Remove value if already selected
                      currentValues.splice(valueIndex, 1);
                    }
                    
                    field.onChange(currentValues);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select guests">
                      {field.value?.length === 1 
                        ? guests.find(g => g.id === field.value![0])?.name 
                        : `${field.value?.length || 0} guests selected`}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {guests.map((guest) => (
                    <SelectItem 
                      key={guest.id} 
                      value={guest.id}
                      className={cn(
                        "flex items-center",
                        field.value?.includes(guest.id) && "bg-secondary"
                      )}
                    >
                      <div className="flex items-center">
                        {field.value?.includes(guest.id) && (
                          <span className="mr-2">✓</span>
                        )}
                        {guest.name}
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="all">Select All Guests</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((guestId) => {
                      const guest = guests.find(g => g.id === guestId);
                      return (
                        <div key={guestId} className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                          {guest?.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-2"
                            onClick={() => {
                              field.onChange(field.value?.filter(id => id !== guestId));
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
