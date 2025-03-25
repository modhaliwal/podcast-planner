
import { UseFormReturn } from "react-hook-form";
import { BioSection } from "./BioSection";
import { BackgroundResearchSection } from "./BackgroundResearchSection";
import { NotesSection } from "./NotesSection";

interface ContentSectionProps {
  form: UseFormReturn<any>;
  notes: string;
  setNotes: (value: string) => void;
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
}

export function ContentSection({ 
  form, 
  notes,
  setNotes,
  backgroundResearch,
  setBackgroundResearch
}: ContentSectionProps) {
  return (
    <div className="space-y-6">
      <BioSection form={form} />
      <BackgroundResearchSection 
        backgroundResearch={backgroundResearch}
        setBackgroundResearch={setBackgroundResearch}
      />
      <NotesSection 
        notes={notes}
        setNotes={setNotes}
      />
    </div>
  );
}
