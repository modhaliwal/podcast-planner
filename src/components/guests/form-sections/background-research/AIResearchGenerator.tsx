
import { Guest } from '@/lib/types';
import { ContentGenerator, ContentGenerationConfig } from '@/components/content/ContentGenerator';
import { UseFormReturn } from 'react-hook-form';

interface AIResearchGeneratorProps {
  guest?: Guest;
  form: UseFormReturn<any>;
  onGenerationComplete: (markdown: string) => void;
}

export function AIResearchGenerator({ guest, form, onGenerationComplete }: AIResearchGeneratorProps) {
  if (!guest || !form) {
    console.error("AIResearchGenerator: Missing guest or form");
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
    generationType: "research" // Specify that we're generating research
  };

  return <ContentGenerator config={config} form={form} />;
}
