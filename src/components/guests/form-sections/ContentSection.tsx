
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
  bioVersions: ContentVersion[];
  backgroundResearchVersions: ContentVersion[];
  onBioVersionsChange: (versions: ContentVersion[]) => void;
  onBackgroundResearchVersionsChange: (versions: ContentVersion[]) => void;
  guest?: Guest;
}

export function ContentSection({ 
  form, 
  notes,
  setNotes,
  backgroundResearch,
  setBackgroundResearch,
  bioVersions = [],
  backgroundResearchVersions = [],
  onBioVersionsChange,
  onBackgroundResearchVersionsChange,
  guest
}: ContentSectionProps) {
  return (
    <div className="space-y-6">
      <BioSection 
        form={form} 
        bioVersions={bioVersions}
        onVersionsChange={onBioVersionsChange}
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
