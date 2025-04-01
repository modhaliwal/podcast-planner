
import { UseFormReturn } from "react-hook-form";
import { Guest } from "@/lib/types";
import { AIGenerationField } from "@/components/shared/AIGenerationField";
import { Card } from "@/components/ui/card";

interface BioSectionProps {
  form: UseFormReturn<any>;
  guest?: Guest;
}

export function BioSection({ form, guest }: BioSectionProps) {
  // Format social links as a new-line separated string
  const formatSocialLinks = () => {
    if (!guest?.socialLinks) return "";
    
    const links = [];
    if (guest.socialLinks.twitter) links.push(guest.socialLinks.twitter);
    if (guest.socialLinks.linkedin) links.push(guest.socialLinks.linkedin);
    if (guest.socialLinks.facebook) links.push(guest.socialLinks.facebook);
    if (guest.socialLinks.instagram) links.push(guest.socialLinks.instagram);
    if (guest.socialLinks.tiktok) links.push(guest.socialLinks.tiktok);
    if (guest.socialLinks.youtube) links.push(guest.socialLinks.youtube);
    if (guest.socialLinks.website) links.push(guest.socialLinks.website);
    
    return links.join('\n');
  };
  
  // Generate parameters for the AI generator
  const generationParameters = {
    name: guest?.name || '',
    title: guest?.title || '',
    company: guest?.company || '',
    links: formatSocialLinks()
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Bio</h3>
      
      <AIGenerationField
        buttonLabel="Generate Bio"
        loadingLabel="Generating Bio..."
        generatorSlug="guest-bio-generator"
        generationParameters={generationParameters}
        showEditor={true}
        editorType="plain" 
        editorPlaceholder="Guest biography..."
        userIdentifier="manual"
        contentName="Bio"
        // Form integration - directly connect to form fields
        formField="bio"
        versionsField="bioVersions"
        hoverCardConfig={{
          promptTitle: "Guest Bio Generator",
          generatorSlug: "guest-bio-generator"
        }}
      />
    </Card>
  );
}
