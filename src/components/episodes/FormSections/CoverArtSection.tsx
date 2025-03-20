
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, Upload, X, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { isBlobUrl } from '@/lib/imageUpload';

interface CoverArtSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function CoverArtSection({ form }: CoverArtSectionProps) {
  const currentCoverArt = form.getValues('coverArt');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentCoverArt || null);
  const [originalCoverArt, setOriginalCoverArt] = useState<string | undefined>(currentCoverArt);
  
  // Store the original cover art URL when component mounts
  useEffect(() => {
    setOriginalCoverArt(form.getValues('coverArt'));
  }, [form]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("File must be an image.");
      return;
    }
    
    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Set the form value to the blob URL temporarily
    // This allows the form to track that we have a new image
    form.setValue('coverArt', url, { shouldValidate: true });
  };
  
  const resetCoverArt = () => {
    // If current preview is a blob URL, revoke it to prevent memory leaks
    if (previewUrl && isBlobUrl(previewUrl)) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Reset to original image
    setPreviewUrl(originalCoverArt || null);
    form.setValue('coverArt', originalCoverArt, { shouldValidate: true });
    toast.info("Cover art reset to original");
  };
  
  const removeCoverArt = () => {
    if (previewUrl && isBlobUrl(previewUrl)) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    form.setValue('coverArt', undefined, { shouldValidate: true });
    toast.success("Cover art removed");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cover Art</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="coverArt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Episode Cover Art</FormLabel>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 order-2 md:order-1">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Upload a square image for your episode's cover art. This will be displayed in podcast directories and players.
                    </p>
                    <p className="text-sm font-medium">Requirements:</p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                      <li>Recommended size: 1400×1400 pixels</li>
                      <li>Maximum size: 5MB</li>
                      <li>Formats: JPG, PNG, GIF</li>
                      <li>Square aspect ratio (1:1)</li>
                    </ul>
                    
                    <div className="mt-4 flex gap-2">
                      <FormControl>
                        <div className="flex flex-col">
                          <Button
                            type="button"
                            variant="outline"
                            className="relative overflow-hidden w-full md:w-auto"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {previewUrl ? "Change Cover Art" : "Upload Cover Art"}
                            <Input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </Button>
                        </div>
                      </FormControl>
                      
                      {previewUrl && previewUrl !== originalCoverArt && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetCoverArt}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto order-1 md:order-2">
                  <div className="max-w-[240px] mx-auto md:mx-0 md:ml-auto">
                    {previewUrl ? (
                      <div className="relative rounded-md overflow-hidden border border-border">
                        <AspectRatio ratio={1}>
                          <img 
                            src={previewUrl} 
                            alt="Cover art preview" 
                            className="object-cover w-full h-full"
                            onError={() => {
                              console.error("Failed to load image preview:", previewUrl);
                              setPreviewUrl(null);
                            }}
                          />
                        </AspectRatio>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={removeCoverArt}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-md overflow-hidden border border-border bg-muted">
                        <AspectRatio ratio={1}>
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Image className="h-12 w-12 mb-2 opacity-40" />
                            <span className="text-sm">No cover art</span>
                            <span className="text-xs mt-1">Recommended: 1400×1400 px</span>
                          </div>
                        </AspectRatio>
                      </div>
                    )}
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
