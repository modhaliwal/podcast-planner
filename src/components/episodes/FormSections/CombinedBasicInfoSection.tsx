
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, Upload, Trash, PenLine, Hash, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { isBlobUrl } from '@/lib/imageUpload';

interface CombinedBasicInfoSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function CombinedBasicInfoSection({ form }: CombinedBasicInfoSectionProps) {
  const currentCoverArt = form.getValues('coverArt');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [localBlobUrl, setLocalBlobUrl] = useState<string | undefined>(undefined);
  
  // Set initial image preview
  useEffect(() => {
    // Only set initial image if it's not a blob URL (which would be invalid after page refresh)
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

    // Revoke any existing blob URL to prevent memory leaks
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
    }

    // Create a new blob URL for preview only
    const previewUrl = URL.createObjectURL(file);
    setLocalBlobUrl(previewUrl);
    setImagePreview(previewUrl);
    
    // Set the form value to the blob URL temporarily
    form.setValue('coverArt', previewUrl, { shouldValidate: true });
  };

  const resetImage = () => {
    // Revoke the temporary blob URL to prevent memory leaks
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
      setLocalBlobUrl(undefined);
    }
    
    // Reset to initial image if it's not a blob URL
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
    // Clean up blob URLs when component unmounts
    return () => {
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [localBlobUrl]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background rounded-lg border shadow-sm p-6">
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="recorded">Recorded</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div>
        <FormField
          control={form.control}
          name="coverArt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Art</FormLabel>
              <div className="flex flex-col gap-4">
                <div className="w-full max-w-[200px]">
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
                        {imagePreview ? "Change" : "Upload"}
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
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
