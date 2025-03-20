
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface CoverArtSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function CoverArtSection({ form }: CoverArtSectionProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(form.getValues('coverArt') || null);
  
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
    
    // In a real application, you would upload the file to a server here
    // and set the returned URL as the coverArt value
    // For this example, we'll just use the preview URL
    form.setValue('coverArt', url, { shouldValidate: true });
    
    toast.success("Cover art uploaded successfully");
  };
  
  const removeCoverArt = () => {
    if (previewUrl) {
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
              <div className="mt-2 space-y-4">
                <div className="max-w-[300px] mx-auto">
                  {previewUrl ? (
                    <div className="relative rounded-md overflow-hidden border border-border">
                      <AspectRatio ratio={1}>
                        <img 
                          src={previewUrl} 
                          alt="Cover art preview" 
                          className="object-cover w-full h-full"
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
                
                <div className="flex justify-center mt-4">
                  <FormControl>
                    <div className="flex flex-col items-center">
                      <Button
                        type="button"
                        variant="outline"
                        className="relative overflow-hidden"
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
                      <p className="text-xs text-muted-foreground mt-2">
                        Maximum size: 5MB. Formats: JPG, PNG, GIF.
                      </p>
                    </div>
                  </FormControl>
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
