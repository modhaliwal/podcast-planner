
import { FormField } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Guest } from '@/lib/types';
import { useState, useEffect, memo } from 'react';
import { GuestSelector } from './GuestComponents/GuestSelector';
import { SelectedGuestsGrid } from './GuestComponents/SelectedGuestsGrid';
import { LoadingIndicator } from '@/components/ui/loading-indicator';

interface GuestsSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[]; // Make this required
}

export const GuestsSection = memo(function GuestsSection({ form, guests }: GuestsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Set form values for guestIds if they're empty but we have the episode's guest IDs
    const currentGuestIds = form.getValues('guestIds');
    if ((!currentGuestIds || currentGuestIds.length === 0) && guests && guests.length > 0) {
      form.setValue('guestIds', []);
    }
  }, [form, guests]);

  // Handle removing a guest
  const handleRemoveGuest = (guestId: string) => {
    const currentValues = form.getValues('guestIds') || [];
    form.setValue(
      'guestIds', 
      currentValues.filter(id => id !== guestId),
      { shouldValidate: true }
    );
  };

  // If loading, show a spinner
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Guests</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingIndicator message="Loading guests..." />
        </CardContent>
      </Card>
    );
  }

  // If no guests are available, show a message
  if (!guests || guests.length === 0) {
    return (
      <Card>
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
    <Card>
      <CardHeader>
        <CardTitle>Guests</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="guestIds"
          render={() => (
            <>
              <GuestSelector 
                form={form} 
                availableGuests={guests} 
              />
              
              <SelectedGuestsGrid
                selectedGuestIds={form.getValues('guestIds') || []}
                availableGuests={guests}
                onRemoveGuest={handleRemoveGuest}
              />
            </>
          )}
        />
      </CardContent>
    </Card>
  );
});
