
import { UseFormReturn } from 'react-hook-form';
import { ContentVersion } from '@/lib/types';
import { ContentGenerator, ContentGenerationConfig } from '@/components/content/ContentGenerator';

interface BioGenerationProps {
  form: UseFormReturn<any>;
  bio: string;
  setBio: (bio: string) => void;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
}

export function BioGeneration({ form, bio, setBio, versions, onVersionsChange }: BioGenerationProps) {
  // Create configuration for the content generator
  const config: ContentGenerationConfig = {
    fieldName: "bio",
    promptKey: "guest_bio",
    buttonLabel: "Generate Bio",
    loadingLabel: "Generating...",
    onContentGenerated: setBio,
    additionalContext: {
      currentBio: bio,
      versions: versions
    },
    edgeFunctionName: "generate-bio"
  };

  return <ContentGenerator config={config} form={form} />;
}
