
import { UseFormReturn } from "react-hook-form";
import { EpisodeFormValues } from "../../EpisodeFormSchema";
import { Guest } from "@/lib/types";
import { ContentGenerator, ContentGenerationConfig } from "@/components/content/ContentGenerator";

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
  
  return (
    <ContentGenerator 
      config={{
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
        preferredProvider: "perplexity" // Prefer Perplexity for notes
      }}
      form={form}
    />
  );
}
