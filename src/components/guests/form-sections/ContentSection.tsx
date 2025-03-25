
import { UseFormReturn } from "react-hook-form";
import { BioSection } from "./BioSection";
import { NotesSection } from "./NotesSection";

interface ContentSectionProps {
  form: UseFormReturn<any>;
  notes: string;
  setNotes: (value: string) => void;
}

export function ContentSection({ 
  form, 
  notes,
  setNotes
}: ContentSectionProps) {
  return (
    <div className="space-y-6">
      <BioSection form={form} />
      <NotesSection 
        notes={notes}
        setNotes={setNotes}
      />
    </div>
  );
}
