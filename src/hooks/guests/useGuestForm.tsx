
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Guest, ContentVersion } from '@/lib/types';
import { deleteImage, isBlobUrl, uploadImage } from '@/lib/imageUpload';
import { toast } from '@/hooks/toast';
import { ensureVersionNumbers } from '@/hooks/versions';

interface UseGuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => void;
  onCancel: () => void;
}

export function useGuestForm({ guest, onSave, onCancel }: UseGuestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  
  // Initialize form with guest data
  const form = useForm({
    defaultValues: {
      name: guest.name,
      title: guest.title,
      company: guest.company || "",
      email: guest.email || "",
      phone: guest.phone || "",
      bio: guest.bio,
      status: guest.status || "potential",
      twitter: guest.socialLinks.twitter || "",
      facebook: guest.socialLinks.facebook || "",
      linkedin: guest.socialLinks.linkedin || "",
      instagram: guest.socialLinks.instagram || "",
      tiktok: guest.socialLinks.tiktok || "",
      youtube: guest.socialLinks.youtube || "",
      website: guest.socialLinks.website || "",
    },
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setIsImageRemoved(file === null);
  };

  const handleSubmit = async (formData: any, bioVersions: ContentVersion[], backgroundResearchVersions: ContentVersion[], notes: string, backgroundResearch: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
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
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save guest information",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit,
    handleImageChange
  };
}
