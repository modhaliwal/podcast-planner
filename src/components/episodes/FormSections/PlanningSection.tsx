
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine, Calendar as CalendarIcon, Users } from 'lucide-react';
import { BasicFields } from './BasicFields';
import { FormField } from '@/components/ui/form';
import { GuestSelector } from './GuestComponents/GuestSelector';
import { SelectedGuestsGrid } from './GuestComponents/SelectedGuestsGrid';
import { Guest } from '@/lib/types';
import { format } from 'date-fns';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface PlanningSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function PlanningSection({ form, guests }: PlanningSectionProps) {
  // Helper function to format dates for display
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return null;
    
    try {
      if (typeof date === 'string') {
        return format(new Date(date), "PPP");
      }
      return format(date, "PPP");
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          Planning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Basic Information</h3>
          <BasicFields form={form} />
        </div>
        
        {/* Schedule Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            Schedule
          </h3>
          
          <FormField
            control={form.control}
            name="scheduled"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Recording Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value) || <span>Invalid date</span>
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="publishDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Publish Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value) || <span>Invalid date</span>
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Guest Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Guests
          </h3>
          
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
        </div>
      </CardContent>
    </Card>
  );
}
