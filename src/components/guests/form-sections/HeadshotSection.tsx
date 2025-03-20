
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Upload, Trash, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface HeadshotSectionProps {
  initialImageUrl?: string;
  guestName: string;
  onImageChange: (preview: string | undefined, file: File | null) => void;
}

export function HeadshotSection({ initialImageUrl, guestName, onImageChange }: HeadshotSectionProps) {
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialImageUrl);
  const [localBlobUrl, setLocalBlobUrl] = useState<string | undefined>(undefined);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG or WebP)");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image is too large. Maximum size is 10MB");
      return;
    }

    // Revoke any existing blob URL to prevent memory leaks
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
    }

    // Create a new blob URL for preview
    const previewUrl = URL.createObjectURL(file);
    setLocalBlobUrl(previewUrl);
    setImagePreview(previewUrl);
    onImageChange(previewUrl, file);
    toast.success("Image ready for upload");
  };

  const resetImage = () => {
    // Revoke the temporary blob URL to prevent memory leaks
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
      setLocalBlobUrl(undefined);
    }
    
    setImagePreview(initialImageUrl);
    onImageChange(initialImageUrl, null);
  };

  useEffect(() => {
    // Clean up blob URLs when component unmounts
    return () => {
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [localBlobUrl]);

  // Update preview if the initialImageUrl changes (e.g., after successful upload)
  useEffect(() => {
    setImagePreview(initialImageUrl);
  }, [initialImageUrl]);

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="mb-4 w-full max-w-[240px]">
        <AspectRatio ratio={2/3} className="bg-muted rounded-md overflow-hidden border">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={guestName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </AspectRatio>
      </div>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="headshot-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md hover:bg-accent transition-colors">
            <Upload className="h-4 w-4" />
            <span>Upload Headshot</span>
          </div>
          <Input 
            id="headshot-upload" 
            type="file" 
            className="hidden" 
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/webp"
          />
        </Label>
        
        {localBlobUrl && (
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
      
      <p className="text-xs text-muted-foreground mt-2">
        Supports JPEG, PNG or WebP up to 10MB. High-resolution images recommended.
      </p>
    </div>
  );
}
