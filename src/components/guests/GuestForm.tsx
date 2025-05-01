
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/toast";
import { Card } from "@/components/ui/card";
import { FormProvider } from "react-hook-form";
import { Guest } from "@/lib/types";
import { useGuestForm } from "@/hooks/guests/useGuestForm";
import { HeadshotSection } from "./form-sections/HeadshotSection";
import { BasicContactSection } from "./form-sections/BasicContactSection";
import { SocialLinksSection } from "./form-sections/SocialLinksSection";
import { ContentSection } from "./form-sections/ContentSection";
import { FormActions } from "@/components/ui/form-actions";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => Promise<any>;
  onCancel?: () => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

export function GuestForm({ guest, onSave, onCancel, onDelete, isSubmitting: propIsSubmitting }: GuestFormProps) {
  const navigate = useNavigate();
  
  const {
    form,
    isSubmitting: formIsSubmitting,
    handleSubmit,
    handleImageChange
  } = useGuestForm({ guest, onSave, onCancel });

  // Use provided isSubmitting prop or the one from the form hook
  const isSubmitting = propIsSubmitting !== undefined ? propIsSubmitting : formIsSubmitting;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left column - Profile info */}
          <div className="w-full lg:w-1/3 space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-medium mb-3 sm:mb-4">Profile Image</h3>
              <HeadshotSection 
                initialImageUrl={guest?.imageUrl} 
                guestName={guest?.name || 'Guest'}
                onImageChange={handleImageChange}
              />
            </Card>
            
            <BasicContactSection form={form} />
            <SocialLinksSection form={form} />
          </div>
          
          {/* Right column - Content */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            <ContentSection 
              form={form}
              guest={guest}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4 sm:pt-6 border-t">
          {onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Guest
            </Button>
          )}
          
          <FormActions
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            saveText="Save Guest"
          />
        </div>
      </form>
    </FormProvider>
  );
}
