
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, Upload, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { isBlobUrl } from '@/lib/imageUpload';
import { toast } from '@/hooks/use-toast';

interface CoverArtSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function CoverArtSection({ form }: CoverArtSectionProps) {
  const currentCoverArt = form.getValues('coverArt');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [localBlobUrl, setLocalBlobUrl] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (currentCoverArt && !isBlobUrl(currentCoverArt) && typeof currentCoverArt === 'string') {
      console.log("Setting initial cover art preview:", currentCoverArt);
      setImagePreview(currentCoverArt);
    }
  }, [currentCoverArt]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const previewUrl = URL.createObjectURL(file);
    setLocalBlobUrl(previewUrl);
    setImagePreview(previewUrl);
    
    form.setValue('coverArt', previewUrl, { shouldValidate: true });
  };

  const resetImage = () => {
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
      setLocalBlobUrl(undefined);
    }
    
    if (currentCoverArt && !isBlobUrl(currentCoverArt) && typeof currentCoverArt === 'string') {
      setImagePreview(currentCoverArt);
      form.setValue('coverArt', currentCoverArt, { shouldValidate: true });
    } else {
      setImagePreview(undefined);
      form.setValue('coverArt', undefined, { shouldValidate: true });
    }
    
    toast.info("Cover art selection reset");
  };

  useEffect(() => {
    return () => {
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [localBlobUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-primary" />
          Cover Art
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="coverArt"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-[240px]">
                  <AspectRatio ratio={1} className="bg-muted rounded-md overflow-hidden border">
                    {imagePreview ? (
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
                        <span className="text-sm text-muted-foreground">No cover art</span>
                        <span className="text-xs mt-1 text-muted-foreground">Recommended: 1400×1400 px</span>
                      </div>
                    )}
                  </AspectRatio>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          className="relative overflow-hidden"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {imagePreview ? "Change Cover Art" : "Upload Cover Art"}
                          <Input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleImageChange}
                          />
                        </Button>
                      </div>
                    </FormControl>
                    
                    {imagePreview && (
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={resetImage}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Requirements:</p>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Recommended size: 1400×1400 pixels</li>
                      <li>Maximum size: 5MB</li>
                      <li>Formats: JPG, PNG, GIF</li>
                      <li>Square aspect ratio (1:1)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
