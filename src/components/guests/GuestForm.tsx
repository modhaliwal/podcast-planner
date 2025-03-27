
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
import { Button } from "@/components/ui/button";
import { X, SaveIcon } from "lucide-react";

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
            }) => {
              const handleSubmit = async () => {
                setIsSubmitting(true);
                try {
                  const formData = form.getValues();
                  await GuestFormSubmitHandler({
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
                  });
                } catch (error) {
                  console.error("Error submitting form:", error);
                  setIsSubmitting(false);
                }
              };
              
              return (
                <Form {...form}>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }} 
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

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                      >
                        <SaveIcon className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              );
            }}
          </GuestFormVersionsState>
        )}
      </GuestImageState>
    </div>
  );
}
