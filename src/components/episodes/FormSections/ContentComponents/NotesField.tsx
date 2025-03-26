
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { Guest } from "@/lib/types";
import { VersionSelector } from "@/components/guests/form-sections/VersionSelector";
import { EpisodeFormValues } from "../../EpisodeFormSchema";
import { NotesGeneration } from "./NotesGeneration";
import { NotesEditor } from "./NotesEditor";
import { NotesVersionsProvider, useNotesVersions } from "@/contexts/NotesVersionsContext";

// Inner component that uses the context
function NotesFieldContent({
  editMode = true,
  label = "Episode Notes",
  placeholder = "Add episode notes here...",
  guests = [],
}: {
  editMode?: boolean;
  label?: string;
  placeholder?: string;
  guests?: Guest[];
}) {
  const {
    activeVersionId,
    versions,
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion
  } = useNotesVersions();

  const handleNotesGenerated = (notes: string) => {
    // Create new version with AI-generated notes
    addNewVersion(notes, "ai");
  };

  return (
    <FormItem>
      <div className="flex items-center justify-between mb-2">
        <FormLabel>{label}</FormLabel>
        <div className="flex items-center space-x-2">
          {versions.length > 0 && (
            <VersionSelector
              versions={versions}
              onSelectVersion={selectVersion}
              activeVersionId={activeVersionId || undefined}
              onClearAllVersions={clearAllVersions}
            />
          )}
          
          {editMode && (
            <NotesGeneration 
              onNotesGenerated={handleNotesGenerated}
              guests={guests}
            />
          )}
        </div>
      </div>
      
      <NotesEditor
        onBlur={handleContentChange}
        placeholder={placeholder}
        readOnly={!editMode}
      />
      
      <FormMessage />
    </FormItem>
  );
}

// Wrapper component that provides the context
interface NotesFieldProps {
  editMode?: boolean;
  label?: string;
  placeholder?: string;
  form?: UseFormReturn<EpisodeFormValues>;
  guests?: Guest[];
}

export function NotesField({
  editMode = true,
  label = "Episode Notes",
  placeholder = "Add episode notes here...",
  form: formProp,
  guests = [],
}: NotesFieldProps) {
  const formContext = useFormContext<EpisodeFormValues>();
  const form = formProp || formContext;
  
  const fieldName = "notes";
  const versionsFieldName = "notesVersions";
  
  return (
    <NotesVersionsProvider 
      form={form} 
      fieldName={fieldName} 
      versionsFieldName={versionsFieldName}
    >
      <NotesFieldContent 
        editMode={editMode}
        label={label}
        placeholder={placeholder}
        guests={guests}
      />
    </NotesVersionsProvider>
  );
}
