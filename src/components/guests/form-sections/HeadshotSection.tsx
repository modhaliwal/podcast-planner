
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Upload, Trash, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { isBlobUrl, uploadImage } from "@/lib/imageUpload";

interface HeadshotSectionProps {
  initialImageUrl?: string;
  guestName: string;
  onImageChange: (file: File | null, uploadedUrl?: string) => void;
}

export function HeadshotSection({ initialImageUrl, guestName, onImageChange }: HeadshotSectionProps) {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [localBlobUrl, setLocalBlobUrl] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  
  // Set initial image preview
  useEffect(() => {
    // Only set initial image if it's not a blob URL (which would be invalid after page refresh)
    if (initialImageUrl && !isBlobUrl(initialImageUrl)) {
      setImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);
  
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // Upload the image immediately
    try {
      setIsUploading(true);
      toast.info("Uploading image...");
      
      const uploadedUrl = await uploadImage(file);
      
      if (uploadedUrl) {
        // Pass both the file and the uploaded URL to the parent component
        onImageChange(file, uploadedUrl);
        toast.success("Image uploaded successfully");
      } else {
        // If upload failed, just pass the file
        onImageChange(file);
        toast.error("Failed to upload image. Will try again on save.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Will try again on save.");
      onImageChange(file);
    } finally {
      setIsUploading(false);
    }
  };

  const resetImage = () => {
    // Revoke the temporary blob URL to prevent memory leaks
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
      setLocalBlobUrl(undefined);
    }
    
    // Reset to initial image if it's not a blob URL
    if (initialImageUrl && !isBlobUrl(initialImageUrl)) {
      setImagePreview(initialImageUrl);
    } else {
      setImagePreview(undefined);
    }
    
    onImageChange(null);
    toast.info("Image selection reset");
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
    <div className="flex flex-col items-center mb-6">
      <div className="mb-4 w-full max-w-[240px]">
        <AspectRatio ratio={2/3} className="bg-muted rounded-md overflow-hidden border">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={guestName}
              className="w-full h-full object-cover"
              onError={() => {
                console.error("Failed to load image preview:", imagePreview);
                setImagePreview(undefined);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </AspectRatio>
      </div>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="headshot-upload" className={`cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md hover:bg-accent transition-colors">
            <Upload className="h-4 w-4" />
            <span>{isUploading ? "Uploading..." : "Upload Headshot"}</span>
          </div>
          <Input 
            id="headshot-upload" 
            type="file" 
            className="hidden" 
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/webp"
            disabled={isUploading}
          />
        </Label>
        
        {(localBlobUrl || imagePreview) && (
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={resetImage}
            disabled={isUploading}
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
