
import { Guest } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';
import { GuestSelector } from './GuestComponents/GuestSelector';
import { SelectedGuestsGrid } from './GuestComponents/SelectedGuestsGrid';
import { EpisodeFormValues } from '../../episodes/EpisodeFormSchema';

interface GuestsSectionProps {
  form: UseFormReturn<any>;
  guests: Guest[];
}

export function GuestsSection({ form, guests }: GuestsSectionProps) {
  // Get selected guests
  const selectedGuestIds = form.watch('guestIds') || [];
  
  // Memoize available guests list to prevent unnecessary filtering
  const availableGuests = useMemo(() => guests, [guests]);
  
  const handleRemoveGuest = (guestId: string) => {
    const currentGuestIds = [...(form.getValues('guestIds') || [])];
    const updatedGuestIds = currentGuestIds.filter(id => id !== guestId);
    form.setValue('guestIds', updatedGuestIds);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Episode Guests</CardTitle>
        <CardDescription>
          Select the guests appearing on this episode
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Selected guests grid */}
          <SelectedGuestsGrid 
            selectedGuestIds={selectedGuestIds}
            availableGuests={availableGuests}
            onRemoveGuest={handleRemoveGuest}
          />
          
          <ScrollArea className="h-[280px] border rounded-md">
            <div className="p-4">
              <GuestSelector 
                form={form as UseFormReturn<EpisodeFormValues>}
                availableGuests={availableGuests}
              />
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
