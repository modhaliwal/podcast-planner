
import { Guest } from "@/lib/types";
import { AIGenerationField } from "@/components/shared/AIGenerationField";
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";

interface BackgroundResearchSectionProps {
  form: UseFormReturn<any>;
  guest?: Guest;
}

export function BackgroundResearchSection({ form, guest }: BackgroundResearchSectionProps) {
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
    <Card className="p-6">
      <AIGenerationField
        buttonLabel="Generate Research"
        loadingLabel="Researching..."
        generatorSlug="guest-research-generator"
        generationParameters={generationParameters}
        showEditor={true}
        editorType="rich"
        editorPlaceholder="Background research for this guest..."
        userIdentifier="manual"
        contentName="Background Research"
        // Form integration - directly connect to form fields
        formField="backgroundResearch"
        versionsField="backgroundResearchVersions"
        hoverCardConfig={{
          promptTitle: "Guest Research Generator",
          generatorSlug: "guest-research-generator"
        }}
      />
    </Card>
  );
}
