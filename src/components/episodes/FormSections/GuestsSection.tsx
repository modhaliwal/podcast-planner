
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Guest } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface GuestsSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests?: Guest[]; // Make this optional
}

export function GuestsSection({ form, guests: propGuests }: GuestsSectionProps) {
  // Use guests from Auth context if none are provided as props
  const { guests: contextGuests, refreshGuests } = useAuth();
  const [availableGuests, setAvailableGuests] = useState<Guest[]>([]);
  
  useEffect(() => {
    // Ensure we have up-to-date guests data
    refreshGuests();
    
    // Set available guests, preferring props over context
    setAvailableGuests(propGuests || contextGuests);
  }, [propGuests, contextGuests, refreshGuests]);
  
  // Debug logs to identify guest loading issues
  useEffect(() => {
    console.log("GuestsSection - Guest sources:", { 
      propsGuests: propGuests?.length || 0,
      contextGuests: contextGuests?.length || 0,
      availableGuests: availableGuests?.length || 0
    });
  }, [propGuests, contextGuests, availableGuests]);

  // If no guests are available, show a message
  if (!availableGuests || availableGuests.length === 0) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Guests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No guests available. Please add guests from the Guests page.</p>
        </CardContent>
      </Card>
    );
  }

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
                    field.onChange(availableGuests.map(guest => guest.id));
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
                        ? availableGuests.find(g => g.id === field.value![0])?.name 
                        : `${field.value?.length || 0} guests selected`}
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
                      const guest = availableGuests.find(g => g.id === guestId);
                      return (
                        <div key={guestId} className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                          {guest?.name || 'Unknown Guest'}
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
