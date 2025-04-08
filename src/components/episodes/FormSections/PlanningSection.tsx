
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine, Calendar as CalendarIcon, Users, Hash, Activity } from 'lucide-react';
import { Guest } from '@/lib/types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EpisodeStatus } from '@/lib/enums';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { generateTimeOptions } from '@/utils/dateUtils';
import { useCallback } from 'react';
import { GuestSelector } from './GuestComponents/GuestSelector';
import { SelectedGuestsGrid } from './GuestComponents/SelectedGuestsGrid';

interface PlanningSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function PlanningSection({ form, guests }: PlanningSectionProps) {
  // Schedule section helper functions
  const timeOptions = generateTimeOptions();

  // Helper function to format dates for display
  const formatDate = useCallback((date: Date | string | null | undefined) => {
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
  }, []);

  // Extract the time part from a date or set a default
  const getTimeFromDate = useCallback((date: Date | string | null | undefined): string => {
    if (!date) return "10:00";

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, "HH:mm");
    } catch (error) {
      console.error("Error getting time from date:", error);
      return "10:00";
    }
  }, []);

  // Combine date and time
  const combineDateAndTime = useCallback((date: Date | null, timeString: string): Date | null => {
    if (!date) return null;
    
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      return newDate;
    } catch (error) {
      console.error("Error combining date and time:", error);
      return date;
    }
  }, []);

  // Guest selection section handlers
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
        {/* Basic Information (inlined from BasicFields) */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Basic Information</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-muted-foreground" />
                    Episode Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter episode title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="episodeNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    Episode Number
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter episode number" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Status
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select episode status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={EpisodeStatus.SCHEDULED}>{EpisodeStatus.SCHEDULED}</SelectItem>
                      <SelectItem value={EpisodeStatus.RECORDED}>{EpisodeStatus.RECORDED}</SelectItem>
                      <SelectItem value={EpisodeStatus.PUBLISHED}>{EpisodeStatus.PUBLISHED}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Schedule Information (inlined from ScheduleSection) */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            Schedule
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recording Date */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="scheduled"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Recording Date</FormLabel>
                    <div className="flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex-1 pl-3 text-left font-normal",
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
                            onSelect={(date) => {
                              if (date) {
                                // Preserve the time when selecting a new date
                                const currentTime = getTimeFromDate(field.value);
                                const newDate = combineDateAndTime(date, currentTime);
                                field.onChange(newDate);
                              } else {
                                field.onChange(date);
                              }
                            }}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      {/* Time Selector */}
                      <FormControl>
                        <Select
                          value={getTimeFromDate(field.value)}
                          onValueChange={(time) => {
                            // Update the date with the new time
                            const date = field.value instanceof Date ? 
                              field.value : 
                              field.value ? new Date(field.value) : new Date();
                            const dateWithTime = combineDateAndTime(date, time);
                            field.onChange(dateWithTime);
                          }}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Publish Date */}
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
        </div>
        
        {/* Guest Selection (inlined from GuestSelectionSection) */}
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
