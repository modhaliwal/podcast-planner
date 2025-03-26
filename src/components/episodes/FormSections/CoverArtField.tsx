import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, Upload, Trash } from 'lucide-react';
import { isBlobUrl } from '@/lib/imageUpload';
import { toast } from '@/hooks/use-toast';

interface CoverArtFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function CoverArtField({ form }: CoverArtFieldProps) {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [localBlobUrl, setLocalBlobUrl] = useState<string | undefined>(undefined);
  const [isRemoved, setIsRemoved] = useState(false);
  
  const coverArtValue = form.getValues('coverArt');
  
  useEffect(() => {
    setIsRemoved(false);
    
    if (coverArtValue && !isBlobUrl(coverArtValue) && typeof coverArtValue === 'string') {
      console.log("Setting initial cover art preview:", coverArtValue);
      setImagePreview(coverArtValue);
    }
  }, [coverArtValue]);
  
  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG or GIF)");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image is too large. Maximum size is 5MB");
      return;
    }

    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
    }

    setIsRemoved(false);

    const previewUrl = URL.createObjectURL(file);
    setLocalBlobUrl(previewUrl);
    setImagePreview(previewUrl);
    
    form.setValue('coverArt', previewUrl, { shouldValidate: true });
  }, [form, localBlobUrl]);

  const removeImage = useCallback(() => {
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
      setLocalBlobUrl(undefined);
    }
    
    setImagePreview(undefined);
    form.setValue('coverArt', undefined, { shouldValidate: true });
    setIsRemoved(true);
    
    toast.info("Cover art removed");
  }, [form, localBlobUrl]);

  useEffect(() => {
    return () => {
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [localBlobUrl]);

  return (
    <FormField
      control={form.control}
      name="coverArt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cover Art</FormLabel>
          <div className="flex flex-col gap-4">
            <div className="w-full max-w-[200px]">
              <AspectRatio ratio={1} className="bg-muted rounded-md overflow-hidden border">
                {imagePreview && !isRemoved ? (
                  <img
                    src={imagePreview}
                    alt="Cover art preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      console.error("Failed to load image preview:", imagePreview);
                      setImagePreview(undefined);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-muted">
                    <Image className="h-12 w-12 mb-2 text-muted-foreground opacity-40" />
                    <span className="text-xs text-muted-foreground">1400×1400 px</span>
                  </div>
                )}
              </AspectRatio>
            </div>
            
            <div className="flex items-center gap-2">
              <FormControl>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative overflow-hidden"
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {imagePreview && !isRemoved ? "Change" : "Upload"}
                    <Input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageChange}
                    />
                  </Button>
                </div>
              </FormControl>
              
              {imagePreview && !isRemoved && (
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
