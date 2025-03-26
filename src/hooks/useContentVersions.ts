
import { useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { UseFormReturn, Path, PathValue } from "react-hook-form";

interface UseContentVersionsProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: keyof T;
  versionsFieldName: keyof T;
}

export function useContentVersions<T extends Record<string, any>>({
  form,
  fieldName,
  versionsFieldName
}: UseContentVersionsProps<T>) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  // Initialize versions if they don't exist
  useEffect(() => {
    if (!hasInitialized) {
      const currentContent = form.getValues(fieldName as unknown as Path<T>) || "";
      const existingVersions = form.getValues(versionsFieldName as unknown as Path<T>) || [];

      if (Array.isArray(existingVersions) && existingVersions.length === 0 && currentContent) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: String(currentContent),
          timestamp: new Date().toISOString(),
          source: "manual",
          active: true
        };
        
        // Update both the local state and the form value
        setVersions([initialVersion]);
        form.setValue(
          versionsFieldName as unknown as Path<T>, 
          [initialVersion] as unknown as PathValue<T, Path<T>>
        );
        setActiveVersionId(initialVersion.id);
      } else if (Array.isArray(existingVersions) && existingVersions.length > 0) {
        // Find active version or use the most recent one
        const activeVersion = existingVersions.find(v => v.active === true);
        
        if (activeVersion) {
          setVersions(existingVersions);
          setActiveVersionId(activeVersion.id);
          form.setValue(
            fieldName as unknown as Path<T>,
            activeVersion.content as unknown as PathValue<T, Path<T>>
          );
        } else {
          // If no active version found, mark the most recent one as active
          const sortedVersions = [...existingVersions].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          // Update all versions to set the first one as active
          const updatedVersions = existingVersions.map(v => ({
            ...v,
            active: v.id === sortedVersions[0].id
          }));
          
          setVersions(updatedVersions);
          setActiveVersionId(sortedVersions[0].id);
          form.setValue(
            versionsFieldName as unknown as Path<T>,
            updatedVersions as unknown as PathValue<T, Path<T>>
          );
          form.setValue(
            fieldName as unknown as Path<T>,
            sortedVersions[0].content as unknown as PathValue<T, Path<T>>
          );
        }
      }
      
      setHasInitialized(true);
    }
  }, [form, fieldName, versionsFieldName, hasInitialized]);

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

  // For version selector dropdown
  const versionSelectorProps = {
    versions,
    onSelectVersion: selectVersion,
    activeVersionId,
    onClearAllVersions: clearAllVersions
  };

  return {
    activeVersionId,
    versions,
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion,
    versionSelectorProps
  };
}
