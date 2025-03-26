
import { ContentVersion } from "@/lib/types";
import { UseFormReturn, Path, PathValue } from "react-hook-form";

/**
 * Select a specific version as active
 */
export const selectVersionUtil = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  version: ContentVersion,
  versions: ContentVersion[],
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
): void => {
  if (!versions.length) return;
  
  // Update form with the selected version content
  form.setValue(
    fieldName as unknown as Path<T>, 
    version.content as unknown as PathValue<T, Path<T>>,
    { shouldDirty: true }
  );
  
  // Update the active version ID in state
  setActiveVersionId(version.id);
  
  // Update active flags in the versions array
  const updatedVersions = versions.map(v => ({
    ...v,
    active: v.id === version.id
  }));
  
  // Update state and form values
  setVersions(updatedVersions);
  form.setValue(
    versionsFieldName as unknown as Path<T>, 
    updatedVersions as unknown as PathValue<T, Path<T>>,
    { shouldDirty: true }
  );
};
