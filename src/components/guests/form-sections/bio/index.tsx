
import { UseFormReturn } from "react-hook-form";
import { Guest } from "@/lib/types";
import { AIGenerationField } from "@/components/shared/AIGenerationField";
import { Card } from "@/components/ui/card";
import { formatAllLinks } from "@/lib/formatLinks";

interface BioSectionProps {
  form: UseFormReturn<any>;
  guest?: Guest;
  notes?: string;
}

export function BioSection({ form, guest, notes = '' }: BioSectionProps) {
  // Generate parameters for the AI generator
  const generationParameters = {
    name: guest?.name || '',
    title: guest?.title || '',
    company: guest?.company || '',
    links: guest?.socialLinks ? formatAllLinks(guest.socialLinks) : '',
    notes
  };
  
  return (
    <Card className="p-6">
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
