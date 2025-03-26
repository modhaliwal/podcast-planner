import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { isBlobUrl, deleteImage, uploadImage } from '@/lib/imageUpload';

export function useCoverArtHandler(initialCoverArt?: string) {
  const [originalCoverArt, setOriginalCoverArt] = useState<string | undefined>(initialCoverArt);
  
  // Keep original cover art reference up to date
  useEffect(() => {
    setOriginalCoverArt(initialCoverArt);
  }, [initialCoverArt]);
  
  // Handle cover art upload process
  const handleCoverArtUpload = useCallback(async (coverArt: string | undefined): Promise<string | null | undefined> => {
    if (coverArt === originalCoverArt) {
      return coverArt;
    }
    
    if (coverArt && isBlobUrl(coverArt)) {
      console.log("Detected blob URL for cover art, uploading to storage");
      
      try {
        const response = await fetch(coverArt);
        const blob = await response.blob();
        const fileName = 'cover-art.jpg';
        const file = new File([blob], fileName, { type: blob.type });
        
        toast.info("Uploading cover art...");
        const uploadedUrl = await uploadImage(file, 'podcast-planner', 'cover-art');
        
        if (uploadedUrl) {
          console.log("Cover art uploaded successfully:", uploadedUrl);
          
          if (originalCoverArt && !isBlobUrl(originalCoverArt)) {
            console.log("Deleting old cover art:", originalCoverArt);
            await deleteImage(originalCoverArt);
          }
          
          toast.success("Cover art uploaded successfully");
          return uploadedUrl;
        } else {
          toast.error("Failed to upload cover art");
          return undefined;
        }
      } catch (error) {
        console.error("Error uploading cover art:", error);
        toast.error("Error uploading cover art");
        return undefined;
      } finally {
        if (coverArt) {
          URL.revokeObjectURL(coverArt);
        }
      }
    } else if (coverArt === undefined && originalCoverArt) {
      console.log("Deleting old cover art on removal:", originalCoverArt);
      await deleteImage(originalCoverArt);
      toast.success("Cover art removed successfully");
      return null;
    }
    
    return coverArt;
  }, [originalCoverArt]);
  
  return {
    originalCoverArt,
    handleCoverArtUpload
  };
}
