import { useState } from "react";
import { Guest } from "@/lib/types";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { HeadshotSection } from "./form-sections/HeadshotSection";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { SocialLinksSection } from "./form-sections/SocialLinksSection";
import { ContentSection } from "./form-sections/ContentSection";
import { 
  GuestFormSubmitHandler, 
  GuestFormVersionsState,
  GuestImageState
} from "./form";
import { FormActions } from "@/components/ui/form-actions";

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => void;
  onCancel: () => void;
}

export function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
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
      twitter: guest.socialLinks.twitter || "",
      facebook: guest.socialLinks.facebook || "",
      linkedin: guest.socialLinks.linkedin || "",
      instagram: guest.socialLinks.instagram || "",
      tiktok: guest.socialLinks.tiktok || "",
      youtube: guest.socialLinks.youtube || "",
      website: guest.socialLinks.website || "",
    },
  });

  const handleSubmit = async (data: any) => {
    // This function will be handled by GuestFormSubmitHandler
  };

  return (
    <div className="space-y-6">
      <GuestImageState>
        {({ imageFile, isImageRemoved, handleImageChange }) => (
          <GuestFormVersionsState guest={guest}>
            {({ 
              bioVersions, 
              backgroundResearchVersions, 
              notes, 
              backgroundResearch, 
              setBioVersions, 
              setBackgroundResearchVersions, 
              setNotes, 
              setBackgroundResearch 
            }) => (
              <Form {...form}>
                <form 
                  onSubmit={form.handleSubmit(handleSubmit)} 
                  className="space-y-6"
                >
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
                    notes={notes}
                    setNotes={setNotes}
                    backgroundResearch={backgroundResearch}
                    setBackgroundResearch={setBackgroundResearch}
                    bioVersions={bioVersions}
                    backgroundResearchVersions={backgroundResearchVersions}
                    onBioVersionsChange={setBioVersions}
                    onBackgroundResearchVersionsChange={setBackgroundResearchVersions}
                    guest={guest}
                  />

                  <FormActions
                    onCancel={onCancel}
                    isSubmitting={isSubmitting}
                  />

                  <div className="hidden">
                    <GuestFormSubmitHandler
                      guest={guest}
                      isSubmitting={isSubmitting}
                      setIsSubmitting={setIsSubmitting}
                      imageFile={imageFile}
                      isImageRemoved={isImageRemoved}
                      bioVersions={bioVersions}
                      backgroundResearchVersions={backgroundResearchVersions}
                      formData={form.getValues()}
                      notes={notes}
                      backgroundResearch={backgroundResearch}
                      onSave={onSave}
                      onCancel={onCancel}
                    />
                  </div>
                </form>
              </Form>
            )}
          </GuestFormVersionsState>
        )}
      </GuestImageState>
    </div>
  );
}
