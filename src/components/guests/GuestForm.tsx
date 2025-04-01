
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { FormProvider } from "react-hook-form";
import { Guest, ContentVersion } from "@/lib/types";
import { useGuestForm } from "@/hooks/guests/useGuestForm";
import { HeadshotSection } from "./form-sections/HeadshotSection";
import { NotesSection } from "./form-sections/NotesSection";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { ContactSection } from "./form-sections/ContactSection";
import { SocialLinksSection } from "./form-sections/SocialLinksSection";
import { BioSection } from "./form-sections/bio";
import { BackgroundResearchSection } from "./form-sections/background-research";
import { FormActions } from "@/components/ui/form-actions";
import { GuestFormVersionsState } from "./form/GuestFormVersionsState";

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => Promise<any>;
  onCancel: () => void;
}

export function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
  const navigate = useNavigate();
  
  const {
    form,
    isSubmitting,
    handleSubmit,
    handleImageChange
  } = useGuestForm({ guest, onSave, onCancel });

  return (
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
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit((values) => handleSubmit(values, notes, backgroundResearch, bioVersions, backgroundResearchVersions))} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left column - Profile info */}
              <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Profile Image</h3>
                  <HeadshotSection 
                    initialImageUrl={guest?.imageUrl} 
                    guestName={guest?.name || 'Guest'}
                    onImageChange={handleImageChange}
                  />
                </Card>
                
                <BasicInfoSection form={form} />
                <ContactSection form={form} />
                <SocialLinksSection form={form} />
              </div>
              
              {/* Right column - Content */}
              <div className="flex-1 space-y-6">
                <BioSection 
                  form={form} 
                  bioVersions={bioVersions}
                  onVersionsChange={setBioVersions}
                />
                
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Background Research</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Research information about this guest that will help with podcast preparation.
                  </p>
                  <BackgroundResearchSection
                    backgroundResearch={backgroundResearch}
                    setBackgroundResearch={setBackgroundResearch}
                    backgroundResearchVersions={backgroundResearchVersions}
                    onVersionsChange={setBackgroundResearchVersions}
                    guest={guest}
                  />
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Personal Notes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Private notes about this guest that won't be shared publicly.
                  </p>
                  <NotesSection
                    notes={notes}
                    setNotes={setNotes}
                  />
                </Card>
              </div>
            </div>
            
            <FormActions
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              saveText="Save Guest"
            />
          </form>
        </FormProvider>
      )}
    </GuestFormVersionsState>
  );
}
