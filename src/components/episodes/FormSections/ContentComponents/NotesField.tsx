
import { useState } from "react";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { Guest } from "@/lib/types";
import { VersionSelector } from "@/components/guests/form-sections/VersionSelector";
import { EpisodeFormValues } from "../../EpisodeFormSchema";
import { useNotesVersionManager } from "@/hooks/useNotesVersionManager";
import { NotesGeneration } from "./NotesGeneration";
import { NotesEditor } from "./NotesEditor";

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
  
  // Use our custom hook for version management
  const {
    activeVersionId,
    versions,
    handleEditorBlur,
    selectVersion,
    handleClearAllVersions,
    addNewVersion
  } = useNotesVersionManager({
    form,
    fieldName,
    versionsFieldName
  });

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
              onClearAllVersions={handleClearAllVersions}
            />
          )}
          
          {editMode && (
            <NotesGeneration 
              form={form}
              guests={guests}
              onNotesGenerated={handleNotesGenerated}
            />
          )}
        </div>
      </div>
      
      <NotesEditor
        form={form}
        fieldName={fieldName}
        onBlur={handleEditorBlur}
        placeholder={placeholder}
        readOnly={!editMode}
      />
      
      <FormMessage />
    </FormItem>
  );
}
