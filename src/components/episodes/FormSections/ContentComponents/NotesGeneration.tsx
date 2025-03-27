
import { UseFormReturn } from "react-hook-form";
import { EpisodeFormValues } from "../../EpisodeFormSchema";
import { Guest } from "@/lib/types";
import { ContentGenerator } from "@/components/content/ContentGenerator";
import { ContentGenerationConfig } from "@/components/content/types";

interface NotesGenerationProps {
  guests: Guest[];
  onNotesGenerated: (notes: string) => void;
  form: UseFormReturn<EpisodeFormValues>;
}

export function NotesGeneration({ guests, onNotesGenerated, form }: NotesGenerationProps) {
  const selectedGuestIds = form.watch('guestIds') || [];
  const topic = form.watch('topic') || '';
  
  // Find selected guests from the full guests array
  const selectedGuests = guests.filter(g => selectedGuestIds.includes(g.id));
  
  // Create the content generation config
  const config: ContentGenerationConfig = {
    fieldName: "notes",
    promptKey: "episode_notes",
    buttonLabel: "Generate Notes",
    loadingLabel: "Generating notes...",
    onContentGenerated: onNotesGenerated,
    guests: selectedGuests,
    additionalContext: {
      episode: {
        title: form.watch('title') || '',
        topic: topic,
      },
      topic
    },
    edgeFunctionName: 'generate-episode-notes',
    generationType: "notes",
    preferredProvider: "perplexity" // Explicitly set to use Perplexity
  };
  
  return <ContentGenerator config={config} form={form} />;
}
