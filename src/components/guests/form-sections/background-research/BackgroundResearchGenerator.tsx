
import { Guest } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import { ContentGenerator } from "@/components/content/ContentGenerator";
import { ContentGenerationConfig } from "@/components/content/types";

interface BackgroundResearchGeneratorProps {
  guest?: Guest;
  form: UseFormReturn<any>;
  onGenerationComplete: (html: string) => void;
}

export function BackgroundResearchGenerator({ 
  guest, 
  form, 
  onGenerationComplete 
}: BackgroundResearchGeneratorProps) {
  if (!guest || !form) {
    console.error("BackgroundResearchGenerator: Missing guest or form");
    return null;
  }

  const config: ContentGenerationConfig = {
    fieldName: "backgroundResearch",
    promptKey: "guest_research",
    buttonLabel: "Research",
    loadingLabel: "Researching...",
    onContentGenerated: onGenerationComplete,
    additionalContext: {
      guest: guest
    },
    edgeFunctionName: "generate-guest-research",
    generationType: "research",
    preferredProvider: "perplexity" // Prefer Perplexity for research
  };

  return <ContentGenerator config={config} form={form} />;
}
