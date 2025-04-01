
import { UseFormReturn } from "react-hook-form";
import { ContentVersion, Guest } from "@/lib/types";
import { AIGenerationField } from "@/components/shared/AIGenerationField";

interface BioSectionProps {
  form: UseFormReturn<any>;
  bioVersions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  guest?: Guest;
}

export function BioSection({ form, bioVersions = [], onVersionsChange, guest }: BioSectionProps) {
  // Get the bio content from the form
  const bioContent = form.getValues('bio') || '';
  
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Bio</h3>
      </div>
      
      <AIGenerationField
        buttonLabel="Generate Bio"
        loadingLabel="Generating Bio..."
        generatorSlug="guest-bio-generator"
        generationParameters={generationParameters}
        editorContent={bioContent}
        onEditorChange={handleEditorChange}
        showEditor={true}
        editorType="rich"
        editorPlaceholder="Guest biography..."
        editorContentVersions={bioVersions}
        onContentVersionsChange={onVersionsChange}
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
