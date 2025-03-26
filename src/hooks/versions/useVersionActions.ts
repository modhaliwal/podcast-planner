
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { UseFormReturn, Path, PathValue } from "react-hook-form";

interface UseVersionActionsProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: keyof T;
  versionsFieldName: keyof T;
  activeVersionId: string | null;
  versions: ContentVersion[];
  setVersions: (versions: ContentVersion[]) => void;
  setActiveVersionId: (id: string | null) => void;
}

/**
 * Hook to manage version actions (select, create, clear)
 */
export function useVersionActions<T extends Record<string, any>>({
  form,
  fieldName,
  versionsFieldName,
  activeVersionId,
  versions,
  setVersions,
  setActiveVersionId
}: UseVersionActionsProps<T>) {
  
  const handleContentChange = () => {
    const currentContent = form.getValues(fieldName as unknown as Path<T>) || "";
    
    // Check if content is not empty and if we have an active version to compare with
    if (typeof currentContent === 'string' && currentContent.trim() && activeVersionId) {
      const activeVersion = versions.find(v => v.id === activeVersionId);
      
      // Only create a new version if content has changed
      if (activeVersion && currentContent !== activeVersion.content) {
        // Set all versions as inactive
        const updatedVersions = versions.map(v => ({
          ...v,
          active: false
        }));
        
        // Create new active version
        const newVersion: ContentVersion = {
          id: uuidv4(),
          content: currentContent,
          timestamp: new Date().toISOString(),
          source: "manual",
          active: true
        };
        
        const finalVersions = [...updatedVersions, newVersion];
        setVersions(finalVersions);
        form.setValue(
          versionsFieldName as unknown as Path<T>, 
          finalVersions as unknown as PathValue<T, Path<T>>
        );
        setActiveVersionId(newVersion.id);
      }
    }
  };

  const selectVersion = (version: ContentVersion) => {
    // Update form content to match selected version
    form.setValue(
      fieldName as unknown as Path<T>, 
      version.content as unknown as PathValue<T, Path<T>>
    );
    
    // Update active status in all versions
    const updatedVersions = versions.map(v => ({
      ...v,
      active: v.id === version.id
    }));
    
    // Update form and state
    setVersions(updatedVersions);
    form.setValue(
      versionsFieldName as unknown as Path<T>, 
      updatedVersions as unknown as PathValue<T, Path<T>>
    );
    setActiveVersionId(version.id);
  };

  const clearAllVersions = () => {
    const currentContent = form.getValues(fieldName as unknown as Path<T>) || "";
    
    // Create a single version with current content
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: typeof currentContent === 'string' ? currentContent : String(currentContent),
      timestamp: new Date().toISOString(),
      source: "manual",
      active: true
    };
    
    setVersions([newVersion]);
    form.setValue(
      versionsFieldName as unknown as Path<T>, 
      [newVersion] as unknown as PathValue<T, Path<T>>
    );
    setActiveVersionId(newVersion.id);
  };

  const addNewVersion = (content: string, source: "manual" | "ai" | "import" = "manual") => {
    // Set all versions as inactive
    const updatedVersions = versions.map(v => ({
      ...v,
      active: false
    }));
    
    // Create new active version
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      source,
      active: true
    };
    
    const finalVersions = [...updatedVersions, newVersion];
    setVersions(finalVersions);
    form.setValue(
      versionsFieldName as unknown as Path<T>, 
      finalVersions as unknown as PathValue<T, Path<T>>
    );
    setActiveVersionId(newVersion.id);
    
    return newVersion;
  };

  return {
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion
  };
}
