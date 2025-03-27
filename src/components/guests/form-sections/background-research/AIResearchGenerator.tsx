
import { Guest } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';
import { ContentGenerator } from '@/components/content/ContentGenerator';
import { ContentGenerationConfig } from '@/components/content/types';

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
