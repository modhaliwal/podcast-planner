
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { FormField } from '@/components/ui/form';
import { Guest } from '@/lib/types';
import { GuestSelector } from '../GuestComponents/GuestSelector';
import { SelectedGuestsGrid } from '../GuestComponents/SelectedGuestsGrid';

interface GuestSelectionSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  availableGuests: Guest[];
}

export function GuestSelectionSection({ form, availableGuests }: GuestSelectionSectionProps) {
  // Handle removing a guest
  const handleRemoveGuest = (guestId: string) => {
    const currentValues = form.getValues('guestIds') || [];
    form.setValue(
      'guestIds', 
      currentValues.filter(id => id !== guestId),
      { shouldValidate: true }
    );
  };

  return (
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
        </>
      )}
    />
  );
}
