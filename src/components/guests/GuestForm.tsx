
import { useState } from "react";
import { Guest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { HeadshotSection } from "./form-sections/HeadshotSection";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { SocialLinksSection } from "./form-sections/SocialLinksSection";
import { ContentSection } from "./form-sections/ContentSection";
import { uploadImage, deleteImage, isBlobUrl } from "@/lib/imageUpload";
import { toast } from "sonner";

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => void;
  onCancel: () => void;
}

export function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
  const [socialLinks, setSocialLinks] = useState(guest.socialLinks);
  const [backgroundResearch, setBackgroundResearch] = useState(guest.backgroundResearch || "");
  const [notes, setNotes] = useState(guest.notes || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: guest.name,
      title: guest.title,
      company: guest.company || "",
      email: guest.email || "",
      phone: guest.phone || "",
      bio: guest.bio,
      status: guest.status || "potential",
      twitter: socialLinks.twitter || "",
      facebook: socialLinks.facebook || "",
      linkedin: socialLinks.linkedin || "",
      instagram: socialLinks.instagram || "",
      tiktok: socialLinks.tiktok || "",
      youtube: socialLinks.youtube || "",
      website: socialLinks.website || "",
    },
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Handle image upload/deletion
      let imageUrl = guest.imageUrl;
      
      // If we have a new image file, upload it and replace the old URL
      if (imageFile) {
        toast.info("Uploading image...");
        const uploadedUrl = await uploadImage(imageFile);
        
        if (uploadedUrl) {
          // If there was a previous image, try to delete it
          if (imageUrl && !isBlobUrl(imageUrl)) {
            await deleteImage(imageUrl);
          }
          
          imageUrl = uploadedUrl;
          toast.success("Image uploaded successfully");
        } else {
          toast.error("Failed to upload image. Using previous image if available.");
        }
      } else if (imageFile === null && guest.imageUrl && isBlobUrl(guest.imageUrl)) {
        // Clear blob URLs that were previously set but not uploaded
        imageUrl = undefined;
      }
      
      const updatedGuest: Guest = {
        ...guest,
        name: data.name,
        title: data.title,
        company: data.company || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        bio: data.bio,
        notes: notes || undefined,
        backgroundResearch: backgroundResearch || undefined,
        status: data.status,
        imageUrl,
        socialLinks: {
          twitter: data.twitter || undefined,
          facebook: data.facebook || undefined,
          linkedin: data.linkedin || undefined,
          instagram: data.instagram || undefined,
          tiktok: data.tiktok || undefined,
          youtube: data.youtube || undefined,
          website: data.website || undefined,
        },
        updatedAt: new Date().toISOString(),
      };

      onSave(updatedGuest);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save guest information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <HeadshotSection 
                initialImageUrl={guest.imageUrl}
                guestName={form.getValues('name')}
                onImageChange={handleImageChange}
              />
              
              <BasicInfoSection form={form} />
            </div>

            <div className="space-y-4">
              <SocialLinksSection form={form} />
            </div>
          </div>

          <ContentSection 
            form={form}
            backgroundResearch={backgroundResearch}
            setBackgroundResearch={setBackgroundResearch}
            notes={notes}
            setNotes={setNotes}
          />

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
