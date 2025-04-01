
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
  backgroundResearchVersions,
  onVersionsChange,
  guest 
}: BackgroundResearchSectionProps) {
  // Format social links as a string for the AI parameters
  const formatSocialLinks = () => {
    if (!guest?.socialLinks) return "";
    
    const links = [];
    if (guest.socialLinks.twitter) links.push(`Twitter: ${guest.socialLinks.twitter}`);
    if (guest.socialLinks.linkedin) links.push(`LinkedIn: ${guest.socialLinks.linkedin}`);
    if (guest.socialLinks.website) links.push(`Website: ${guest.socialLinks.website}`);
    
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
    <div className="space-y-4">
      <AIGenerationField
        buttonLabel="Generate Research"
        loadingLabel="Researching..."
        generatorSlug="guest-research-generator"
        generationParameters={generationParameters}
        editorContent={backgroundResearch}
        onEditorChange={setBackgroundResearch}
        showEditor={true}
        editorType="rich"
        editorPlaceholder="Background research for this guest..."
        editorContentVersions={backgroundResearchVersions}
        onContentVersionsChange={onVersionsChange}
        userIdentifier="manual"
        contentName="Background Research"
        hoverCardConfig={{
          promptTitle: "Guest Research Generator",
          generatorSlug: "guest-research-generator"
        }}
      />
    </div>
  );
}
