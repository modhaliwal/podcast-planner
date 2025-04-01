
import { FormLabel } from "@/components/ui/form";
import { Guest, ContentVersion } from "@/lib/types";
import { AIGenerationField } from "@/components/shared/AIGenerationField";

interface BackgroundResearchSectionProps {
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  backgroundResearchVersions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  guest?: Guest;
}

export function BackgroundResearchSection({ 
  backgroundResearch, 
  setBackgroundResearch,
  backgroundResearchVersions = [],
  onVersionsChange,
  guest
}: BackgroundResearchSectionProps) {
  
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
    setBackgroundResearch(content);
  };

  return (
    <div className="space-y-4">
      <FormLabel>Background Research</FormLabel>
      
      <AIGenerationField
        buttonLabel="Research Guest"
        loadingLabel="Researching..."
        generatorSlug="guest-research-generator"
        generationParameters={generationParameters}
        editorContent={backgroundResearch}
        onEditorChange={handleEditorChange}
        showEditor={true}
        editorType="rich" 
        editorPlaceholder="Guest background research..."
        userIdentifier="manual"
        contentName="Background Research"
        editorContentVersions={backgroundResearchVersions}
        onContentVersionsChange={onVersionsChange}
        hoverCardConfig={{
          promptTitle: "Guest Research Generator",
          generatorSlug: "guest-research-generator"
        }}
      />
    </div>
  );
}
