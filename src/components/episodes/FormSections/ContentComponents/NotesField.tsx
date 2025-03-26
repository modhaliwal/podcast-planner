
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { Guest, ContentVersion } from "@/lib/types";
import { VersionSelector } from "@/components/guests/form-sections/VersionSelector";
import { EpisodeFormValues } from "../../EpisodeFormSchema";
import { NotesGeneration } from "./NotesGeneration";
import { NotesEditor } from "./NotesEditor";
import { memo, useEffect, useState } from "react";
import { VersionManager } from "@/components/guests/form-sections/VersionManager";
import { v4 as uuidv4 } from "uuid";

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
  // Add state to track form values changes
  const [content, setContent] = useState(form.getValues("notes") || "");
  const [versions, setVersions] = useState<ContentVersion[]>(getCurrentVersions());
  
  // Listen for form value changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.notes !== undefined && value.notes !== content) {
        setContent(value.notes as string);
      }
      
      if (value.notesVersions !== undefined) {
        setVersions(getCurrentVersions());
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, content]);
  
  // Ensure we have valid versions array that meets ContentVersion type requirements
  function getCurrentVersions(): ContentVersion[] {
    const formVersions = form.getValues("notesVersions") || [];
    
    // Ensure each version has required properties
    return formVersions.map(version => ({
      id: version.id || uuidv4(),
      content: version.content || "",
      timestamp: version.timestamp || new Date().toISOString(),
      source: version.source || "manual",
      active: version.active || false,
      versionNumber: version.versionNumber || 1
    }));
  }

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
          versionSelectorProps
        }) => (
          <>
            <div className="flex items-center space-x-2 mb-2">
              {versionSelectorProps.versions.length > 0 && (
                <VersionSelector {...versionSelectorProps} />
              )}
              
              {editMode && (
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
