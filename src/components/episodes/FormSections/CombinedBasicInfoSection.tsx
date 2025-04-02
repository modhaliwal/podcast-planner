
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
      <CardHeader className="card-header">
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3 sm:space-y-4">
          <BasicFields form={form} />
        </div>
        
        <div>
          <CoverArtField form={form} />
        </div>
      </CardContent>
    </Card>
  );
}
