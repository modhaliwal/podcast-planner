
import { UseFormReturn } from "react-hook-form";
import { BioSection } from "./BioSection";
import { BackgroundResearchSection } from "./BackgroundResearchSection";
import { NotesSection } from "./NotesSection";
import { Guest } from "@/lib/types";

interface ContentSectionProps {
  form: UseFormReturn<any>;
  notes: string;
  setNotes: (value: string) => void;
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  guest?: Guest;
}

export function ContentSection({ 
  form, 
  notes,
  setNotes,
  backgroundResearch,
  setBackgroundResearch,
  guest
}: ContentSectionProps) {
  return (
    <div className="space-y-6">
      <BioSection form={form} />
      <BackgroundResearchSection 
        backgroundResearch={backgroundResearch}
        setBackgroundResearch={setBackgroundResearch}
        guest={guest}
      />
      <NotesSection 
        notes={notes}
        setNotes={setNotes}
      />
    </div>
  );
}
