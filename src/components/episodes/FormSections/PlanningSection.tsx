
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine, Calendar as CalendarIcon, Users } from 'lucide-react';
import { BasicFields } from './BasicFields';
import { Guest } from '@/lib/types';
import { ScheduleSection } from './PlanningComponents/ScheduleSection';
import { GuestSelectionSection } from './PlanningComponents/GuestSelectionSection';

interface PlanningSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function PlanningSection({ form, guests }: PlanningSectionProps) {
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
          
          <ScheduleSection form={form} />
        </div>
        
        {/* Guest Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Guests
          </h3>
          
          <GuestSelectionSection
            form={form}
            availableGuests={guests}
          />
        </div>
      </CardContent>
    </Card>
  );
}
