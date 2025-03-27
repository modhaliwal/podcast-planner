
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { FormProvider } from "react-hook-form";
import { Guest } from "@/lib/types";
import { useGuestForm } from "@/hooks/guests/useGuestForm";
import { HeadshotSection } from "./form-sections/HeadshotSection";
import { NotesSection } from "./form-sections/NotesSection";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { ContactSection } from "./form-sections/ContactSection";
import { SocialLinksSection } from "./form-sections/SocialLinksSection";
import { BioSection } from "./form-sections/BioSection";

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => Promise<any>;
  onCancel: () => void;
}

export function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(guest?.notes || "");
  
  const {
    form,
    isSubmitting,
    handleSubmit,
    handleImageChange
  } = useGuestForm({ guest, onSave, onCancel });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => handleSubmit(values, notes))} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Basic Info */}
          <div className="space-y-6">
            <BasicInfoSection form={form} />
            <ContactSection form={form} />
            <SocialLinksSection form={form} />
          </div>
          
          {/* Column 2: Bio and Headshot */}
          <div className="space-y-6">
            <BioSection form={form} />
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Profile Image</h3>
              <HeadshotSection 
                initialImageUrl={guest?.imageUrl} 
                guestName={guest?.name || 'Guest'}
                onImageChange={handleImageChange}
              />
            </Card>
          </div>
          
          {/* Column 3: Notes */}
          <div>
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
        
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Guest"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
