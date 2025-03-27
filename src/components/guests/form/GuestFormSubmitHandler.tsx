
import { Guest, ContentVersion } from "@/lib/types";
import { deleteImage, isBlobUrl, uploadImage } from "@/lib/imageUpload";
import { toast } from "@/hooks/toast";
import { ensureVersionNumbers } from "@/hooks/versions";

interface GuestFormSubmitHandlerProps {
  guest: Guest;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  imageFile: File | null;
  isImageRemoved: boolean;
  bioVersions: ContentVersion[];
  backgroundResearchVersions: ContentVersion[];
  formData: any;
  notes: string;
  backgroundResearch: string;
  onSave: (updatedGuest: Guest) => void;
  onCancel: () => void;
}

export async function GuestFormSubmitHandler({ 
  guest,
  isSubmitting,
  setIsSubmitting,
  imageFile,
  isImageRemoved,
  bioVersions,
  backgroundResearchVersions,
  formData,
  notes,
  backgroundResearch,
  onSave,
  onCancel
}: GuestFormSubmitHandlerProps) {
  try {
    let imageUrl = guest.imageUrl;
    
    if (imageFile) {
      toast({
        title: "Info",
        description: "Uploading image..."
      });
      
      const uploadedUrl = await uploadImage(imageFile, 'podcast-planner', 'headshots');
      
      if (uploadedUrl) {
        if (imageUrl && !isBlobUrl(imageUrl) && uploadedUrl !== imageUrl) {
          await deleteImage(imageUrl);
        }
        
        imageUrl = uploadedUrl;
        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
      }
    } 
    else if (isImageRemoved) {
      imageUrl = null;
    }
    
    // Ensure versions have active flag and version numbers
    const processedBioVersions = ensureVersionNumbers(bioVersions);
    const processedBackgroundVersions = ensureVersionNumbers(backgroundResearchVersions);
    
    const updatedGuest: Guest = {
      ...guest,
      name: formData.name,
      title: formData.title,
      company: formData.company || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      bio: formData.bio,
      bioVersions: processedBioVersions,
      notes: notes || undefined,
      backgroundResearch: backgroundResearch || undefined,
      backgroundResearchVersions: processedBackgroundVersions,
      status: formData.status,
      imageUrl: imageUrl as string | undefined,
      socialLinks: {
        twitter: formData.twitter || undefined,
        facebook: formData.facebook || undefined,
        linkedin: formData.linkedin || undefined,
        instagram: formData.instagram || undefined,
        tiktok: formData.tiktok || undefined,
        youtube: formData.youtube || undefined,
        website: formData.website || undefined,
      },
      updatedAt: new Date().toISOString(),
    };

    await onSave(updatedGuest);
    return true;
  } catch (error) {
    console.error("Error submitting form:", error);
    toast({
      title: "Error",
      description: "Failed to save guest information",
      variant: "destructive"
    });
    return false;
  } finally {
    setIsSubmitting(false);
  }
}
