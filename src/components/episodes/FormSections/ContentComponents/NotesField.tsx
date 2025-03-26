
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { Guest, ContentVersion } from "@/lib/types";
import { VersionSelector } from "@/components/guests/form-sections/VersionSelector";
import { EpisodeFormValues } from "../../EpisodeFormSchema";
import { NotesGeneration } from "./NotesGeneration";
import { NotesEditor } from "./NotesEditor";
import { memo, useEffect, useState, useMemo } from "react";
import { VersionManager } from "@/components/guests/form-sections/VersionManager";
import { v4 as uuidv4 } from "uuid";
import { processVersions } from "@/lib/versionUtils";

// Inner component that uses the VersionManager
const NotesFieldContent = memo(function NotesFieldContent({
  editMode = true,
  label = "Episode Notes",
  placeholder = "Add episode notes here...",
  guests = [],
  form
}: {
  editMode?: boolean;
  label?: string;
  placeholder?: string;
  guests?: Guest[];
  form: UseFormReturn<EpisodeFormValues>;
}) {
  // Process version data from form to ensure it's properly structured
  const initialVersions = useMemo(() => {
    const formVersions = form.getValues("notesVersions") || [];
    return processVersions(formVersions);
  }, [form]);
  
  // Add state to track form values changes
  const [content, setContent] = useState(form.getValues("notes") || "");
  const [versions, setVersions] = useState<ContentVersion[]>(initialVersions);
  
  // Listen for form value changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.notes !== undefined && value.notes !== content) {
        setContent(value.notes as string);
      }
      
      if (value.notesVersions !== undefined && value.notesVersions !== versions) {
        setVersions(processVersions(value.notesVersions as ContentVersion[]));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, content, versions]);
  
  return (
    <FormItem>
      <div className="flex items-center justify-between mb-2">
        <FormLabel>{label}</FormLabel>
      </div>
      
      <VersionManager
        content={content}
        versions={versions}
        onVersionsChange={(newVersions) => {
          setVersions(newVersions);
          form.setValue("notesVersions", newVersions, { shouldDirty: true });
        }}
        onContentChange={(newContent) => {
          setContent(newContent);
          form.setValue("notes", newContent, { shouldDirty: true });
        }}
      >
        {({
          handleContentChange,
          addNewVersion,
          versionSelectorProps,
          hasInitialized
        }) => (
          <>
            <div className="flex items-center space-x-2 mb-2">
              {hasInitialized && versionSelectorProps.versions.length > 0 && (
                <VersionSelector {...versionSelectorProps} />
              )}
              
              {editMode && hasInitialized && (
                <NotesGeneration 
                  onNotesGenerated={(notes) => addNewVersion(notes, "ai")}
                  guests={guests}
                  form={form}
                />
              )}
            </div>
            
            <NotesEditor
              onBlur={handleContentChange}
              placeholder={placeholder}
              readOnly={!editMode}
            />
            
            <FormMessage />
          </>
        )}
      </VersionManager>
    </FormItem>
  );
});

// Wrapper component that provides the VersionManager
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
  
  if (!form) {
    console.error("NotesField: No form context or prop provided");
    return null;
  }
  
  return (
    <NotesFieldContent 
      editMode={editMode}
      label={label}
      placeholder={placeholder}
      guests={guests}
      form={form}
    />
  );
}
