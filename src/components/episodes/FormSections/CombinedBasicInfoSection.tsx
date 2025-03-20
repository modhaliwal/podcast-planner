
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { BasicFields } from './BasicFields';
import { CoverArtField } from './CoverArtField';

interface CombinedBasicInfoSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function CombinedBasicInfoSection({ form }: CombinedBasicInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background rounded-lg border shadow-sm p-6">
      <BasicFields form={form} />
      <div>
        <CoverArtField form={form} />
      </div>
    </div>
  );
}
