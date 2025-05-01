
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine } from 'lucide-react';
import { BasicFields } from './BasicFields';
import { CoverArtField } from './CoverArtField';
import { useState } from 'react';
import { uploadImage } from '@/lib/imageUpload';
import { toast } from '@/hooks/toast/use-toast';

interface CombinedBasicInfoSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function CombinedBasicInfoSection({ form }: CombinedBasicInfoSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const coverArt = form.watch('coverArt');

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImage(file, 'podcast-planner', 'cover-art');
      
      if (uploadedUrl) {
        form.setValue('coverArt', uploadedUrl, { shouldValidate: true, shouldDirty: true });
        toast({
          title: "Success",
          description: "Cover art uploaded successfully"
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to upload cover art: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    form.setValue('coverArt', undefined, { shouldValidate: true, shouldDirty: true });
    toast({
      title: "Cover art removed",
      description: "Cover art has been removed"
    });
  };

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
          <CoverArtField
            coverArt={typeof coverArt === 'string' ? coverArt : undefined}
            onUpload={handleUpload}
            onRemove={handleRemove}
            isUploading={isUploading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
