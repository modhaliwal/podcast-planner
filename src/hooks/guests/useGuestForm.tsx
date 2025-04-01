
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Guest, ContentVersion } from '@/lib/types';
import { deleteImage, isBlobUrl, uploadImage } from '@/lib/imageUpload';
import { toast } from '@/hooks/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const GuestFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  bioVersions: z.array(z.any()).optional(),
  backgroundResearch: z.string().optional().or(z.literal("")),
  backgroundResearchVersions: z.array(z.any()).optional(),
  notes: z.string().optional().or(z.literal("")),
  status: z.enum(["potential", "contacted", "confirmed", "appeared"]),
  twitter: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  tiktok: z.string().optional().or(z.literal("")),
  youtube: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
});

interface UseGuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => Promise<any>;
  onCancel: () => void;
}

export function useGuestForm({ guest, onSave, onCancel }: UseGuestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  
  // Initialize form with guest data
  const form = useForm({
    resolver: zodResolver(GuestFormSchema),
    defaultValues: {
      name: guest.name,
      title: guest.title,
      company: guest.company || "",
      email: guest.email || "",
      phone: guest.phone || "",
      bio: guest.bio || "",
      bioVersions: guest.bioVersions || [],
      backgroundResearch: guest.backgroundResearch || "",
      backgroundResearchVersions: guest.backgroundResearchVersions || [],
      notes: guest.notes || "",
      status: guest.status || "potential",
      twitter: guest.socialLinks.twitter || "",
      facebook: guest.socialLinks.facebook || "",
      linkedin: guest.socialLinks.linkedin || "",
      instagram: guest.socialLinks.instagram || "",
      tiktok: guest.socialLinks.tiktok || "",
      youtube: guest.socialLinks.youtube || "",
      website: guest.socialLinks.website || "",
    },
    mode: "onChange"
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setIsImageRemoved(file === null);
  };

  const handleSubmit = async (formData: any) => {
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
      
      const updatedGuest: Guest = {
        ...guest,
        name: formData.name,
        title: formData.title,
        company: formData.company || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        bio: formData.bio || "",
        bioVersions: formData.bioVersions || [],
        backgroundResearch: formData.backgroundResearch || undefined,
        backgroundResearchVersions: formData.backgroundResearchVersions || [],
        notes: formData.notes || undefined,
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
