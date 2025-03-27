
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { generateTimeOptions } from '@/utils/dateUtils';
import { useCallback } from 'react';

interface ScheduleSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function ScheduleSection({ form }: ScheduleSectionProps) {
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

  return (
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
  );
}
