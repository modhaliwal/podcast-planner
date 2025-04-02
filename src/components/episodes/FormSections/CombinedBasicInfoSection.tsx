
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine } from 'lucide-react';
import { BasicFields } from './BasicFields';
import { CoverArtField } from './CoverArtField';

interface CombinedBasicInfoSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function CombinedBasicInfoSection({ form }: CombinedBasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-4 pb-2">
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-3">
          <BasicFields form={form} />
        </div>
        
        <div>
          <CoverArtField form={form} />
        </div>
      </CardContent>
    </Card>
  );
}
