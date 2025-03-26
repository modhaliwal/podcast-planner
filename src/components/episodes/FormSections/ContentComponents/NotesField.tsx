import { useVersionManager } from "@/hooks/versions";
import { ContentVersion } from "@/lib/types";
import { Editor } from "@/components/editor/Editor";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { EpisodeFormValues } from "@/components/episodes/EpisodeFormSchema";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

interface NotesFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
  showLabel?: boolean;
}

export function NotesField({ form, showLabel = true }: NotesFieldProps) {
  const { getValues, setValue, watch } = form;
  const [initialContent] = useState(getValues("notes") || "");
  const watchedNotes = watch("notes") || "";
  const watchedVersions = watch("notesVersions") || [];
  
  // Ensure we have valid versions
  const typedVersions = Array.isArray(watchedVersions) 
    ? watchedVersions.map(v => ({
        id: v.id || crypto.randomUUID(),
        content: v.content || "",
        timestamp: v.timestamp || new Date().toISOString(),
        source: v.source || "manual",
        versionNumber: v.versionNumber || 1,
        active: v.active || false
      }) as ContentVersion)
    : [];
  
  const { 
    versions, 
    addVersion, 
    setContent 
  } = useVersionManager({
    content: watchedNotes,
    initialVersions: typedVersions,
    onContentChange: (content) => {
      setValue("notes", content, { shouldDirty: true });
    },
  });
  
  // Keep versioning state in sync with form
  useEffect(() => {
    if (versions.length > 0 && JSON.stringify(versions) !== JSON.stringify(watchedVersions)) {
      setValue("notesVersions", versions as any, { shouldDirty: true });
    }
  }, [versions, setValue, watchedVersions]);
  
  // Handle content save
  const handleSave = (content: string) => {
    setContent(content);
    const updatedVersions = addVersion(content);
    setValue("notesVersions", updatedVersions as any, { shouldDirty: true });
  };
  
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem className="w-full">
          {showLabel && <FormLabel>Episode Notes</FormLabel>}
          <Editor
            value={field.value || ""}
            onChange={(value) => {
              field.onChange(value);
            }}
            onSave={handleSave}
            placeholder="Use this editor to write or generate your episode notes..."
          />
        </FormItem>
      )}
    />
  );
}
