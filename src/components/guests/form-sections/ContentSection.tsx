
import { UseFormReturn } from "react-hook-form";
import { BioSection } from "./bio"; 
import { BackgroundResearchSection } from "./background-research";
import { NotesSection } from "./NotesSection";
import { Guest, ContentVersion } from "@/lib/types";

interface ContentSectionProps {
  form: UseFormReturn<any>;
  notes: string;
  setNotes: (value: string) => void;
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  backgroundResearchVersions: ContentVersion[];
  onBackgroundResearchVersionsChange: (versions: ContentVersion[]) => void;
  guest?: Guest;
}

export function ContentSection({ 
  form, 
  notes,
  setNotes,
  backgroundResearch,
  setBackgroundResearch,
  backgroundResearchVersions = [],
  onBackgroundResearchVersionsChange,
  guest
}: ContentSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Guest Background</h3>
      </div>

      <BioSection 
        form={form} 
        guest={guest}
      />
      <BackgroundResearchSection 
        backgroundResearch={backgroundResearch}
        setBackgroundResearch={setBackgroundResearch}
        backgroundResearchVersions={backgroundResearchVersions}
        onVersionsChange={onBackgroundResearchVersionsChange}
        guest={guest}
      />
      <NotesSection 
        notes={notes}
        setNotes={setNotes}
      />
    </div>
  );
}
