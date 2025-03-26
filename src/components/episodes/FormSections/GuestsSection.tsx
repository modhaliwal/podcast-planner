
import { FormField } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Guest } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { GuestSelector } from './GuestComponents/GuestSelector';
import { SelectedGuestsGrid } from './GuestComponents/SelectedGuestsGrid';
import { Button } from '@/components/ui/button';
import { LoadingIndicator } from '@/components/ui/loading-indicator';

interface GuestsSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests?: Guest[]; // Make this optional
}

export function GuestsSection({ form, guests: propGuests }: GuestsSectionProps) {
  // Use guests from Auth context if none are provided as props
  const { guests: contextGuests, refreshGuests } = useAuth();
  const [availableGuests, setAvailableGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Ensure we have up-to-date guests data
    const loadGuests = async () => {
      setIsLoading(true);
      if (!propGuests || propGuests.length === 0) {
        await refreshGuests();
      }
      setIsLoading(false);
    };
    
    loadGuests();
  }, [propGuests, refreshGuests]);
  
  useEffect(() => {
    // Set available guests, preferring props over context
    if (propGuests && propGuests.length > 0) {
      setAvailableGuests(propGuests);
    } else if (contextGuests && contextGuests.length > 0) {
      setAvailableGuests(contextGuests);
    }
  }, [propGuests, contextGuests]);

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
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Guests</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingIndicator message="Loading guests..." />
        </CardContent>
      </Card>
    );
  }

  // If no guests are available after loading, show a message
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
          render={() => (
            <>
              <GuestSelector 
                form={form} 
                availableGuests={availableGuests} 
              />
              
              <SelectedGuestsGrid
                selectedGuestIds={form.getValues('guestIds') || []}
                availableGuests={availableGuests}
                onRemoveGuest={handleRemoveGuest}
              />
              
              {/* Legacy tag-style selected guests (now hidden) */}
              <div className="hidden flex-wrap gap-2 mt-2">
                {form.getValues('guestIds') && form.getValues('guestIds').length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.getValues('guestIds').map((guestId) => {
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
                              const currentValues = form.getValues('guestIds') || [];
                              form.setValue(
                                'guestIds', 
                                currentValues.filter(id => id !== guestId),
                                { shouldValidate: true }
                              );
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
            </>
          )}
        />
      </CardContent>
    </Card>
  );
}
