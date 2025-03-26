
import { UseFormReturn } from "react-hook-form";
import { EpisodeFormValues } from "../../EpisodeFormSchema";
import { Guest } from "@/lib/types";
import { ContentGenerator, ContentGenerationConfig } from "@/components/content/ContentGenerator";

interface NotesGenerationProps {
  guests: Guest[];
  onNotesGenerated: (notes: string) => void;
  form?: UseFormReturn<EpisodeFormValues>;
}

export function NotesGeneration({ 
  guests,
  onNotesGenerated,
  form
}: NotesGenerationProps) {
  if (!form) {
    console.error("NotesGeneration: No form context or prop provided");
    return null;
  }

  const config: ContentGenerationConfig = {
    fieldName: "notes",
    promptKey: "episode_notes",
    buttonLabel: "Generate Notes",
    loadingLabel: "Generating...",
    onContentGenerated: onNotesGenerated,
    guests: guests,
    edgeFunctionName: "generate-episode-notes"
  };

  return <ContentGenerator config={config} form={form} />;
}
