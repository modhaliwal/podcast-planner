
import { UseFormReturn } from "react-hook-form";
import { Guest } from "@/lib/types";
import { AIGenerationField } from "@/components/shared/AIGenerationField";

interface BioSectionProps {
  form: UseFormReturn<any>;
  guest?: Guest;
}

export function BioSection({ form, guest }: BioSectionProps) {
  // Get the bio content from the form
  const bioContent = form.watch('bio') || '';
  
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
  
  // Handle content change from editor
  const handleEditorChange = (content: string) => {
    form.setValue('bio', content, { shouldDirty: true });
  };
  
  return (
    <div className="space-y-4">
      
      <AIGenerationField
        buttonLabel="Generate Bio"
        loadingLabel="Generating Bio..."
        generatorSlug="guest-bio-generator"
        generationParameters={generationParameters}
        editorContent={bioContent}
        onEditorChange={handleEditorChange}
        showEditor={true}
        editorType="plain" 
        editorPlaceholder="Guest biography..."
        userIdentifier="manual"
        contentName="Bio"
        hoverCardConfig={{
          promptTitle: "Guest Bio Generator",
          generatorSlug: "guest-bio-generator"
        }}
      />
    </div>
  );
}
