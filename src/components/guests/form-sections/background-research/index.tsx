
import { Guest } from "@/lib/types";
import { AIGenerationField } from "@/components/shared/AIGenerationField";
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { formatAllLinks } from "@/lib/formatLinks";

interface BackgroundResearchSectionProps {
  form: UseFormReturn<any>;
  guest?: Guest;
}

export function BackgroundResearchSection({ form, guest }: BackgroundResearchSectionProps) {
  // Generate parameters for the AI generator
  const generationParameters = {
    name: guest?.name || '',
    title: guest?.title || '',
    company: guest?.company || '',
    links: guest?.socialLinks ? formatAllLinks(guest.socialLinks) : ''
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
