
import { useState } from "react";
import { Guest } from "@/lib/types";
import { Form } from "@/components/ui/form";
import { HeadshotSection } from "./form-sections/HeadshotSection";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { SocialLinksSection } from "./form-sections/SocialLinksSection";
import { ContentSection } from "./form-sections/ContentSection";
import { 
  GuestFormVersionsState,
} from "./form";
import { FormActions } from "@/components/ui/form-actions";
import { useGuestForm } from "@/hooks/guests/useGuestForm";

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => void;
  onCancel: () => void;
}

export function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
  const { form, isSubmitting, handleSubmit, handleImageChange } = useGuestForm({
    guest,
    onSave,
    onCancel
  });

  return (
    <div className="space-y-6">
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
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(
                  form.getValues(), 
                  bioVersions, 
                  backgroundResearchVersions, 
                  notes, 
                  backgroundResearch
                );
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
                <FormActions
                  onCancel={onCancel}
                  isSubmitting={isSubmitting}
                  saveText="Save Changes"
                />
              </div>
            </form>
          </Form>
        )}
      </GuestFormVersionsState>
    </div>
  );
}
