
import { useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { UseFormReturn } from "react-hook-form";

interface UseContentVersionsProps<T> {
  form: UseFormReturn<T>;
  fieldName: keyof T;
  versionsFieldName: keyof T;
}

export function useContentVersions<T>({
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
      const currentContent = form.getValues(fieldName as string) || "";
      const existingVersions = form.getValues(versionsFieldName as string) || [];

      if (existingVersions.length === 0 && currentContent) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentContent,
          timestamp: new Date().toISOString(),
          source: "manual",
        };
        
        // Update both the local state and the form value
        setVersions([initialVersion]);
        form.setValue(versionsFieldName as string, [initialVersion]);
        setActiveVersionId(initialVersion.id);
      } else if (existingVersions.length > 0) {
        // Set to the most recent version
        const sortedVersions = [...existingVersions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setVersions(sortedVersions as ContentVersion[]);
        setActiveVersionId(sortedVersions[0].id);
      }
      
      setHasInitialized(true);
    }
  }, [form, fieldName, versionsFieldName, hasInitialized]);

  const handleContentChange = () => {
    const currentContent = form.getValues(fieldName as string) || "";
    
    // Check if content is not empty and if we have an active version to compare with
    if (currentContent.trim && currentContent.trim() && activeVersionId) {
      const activeVersion = versions.find(v => v.id === activeVersionId);
      
      // Only create a new version if content has changed
      if (activeVersion && currentContent !== activeVersion.content) {
        const newVersion: ContentVersion = {
          id: uuidv4(),
          content: currentContent,
          timestamp: new Date().toISOString(),
          source: "manual"
        };
        
        const updatedVersions = [...versions, newVersion];
        setVersions(updatedVersions);
        form.setValue(versionsFieldName as string, updatedVersions);
        setActiveVersionId(newVersion.id);
      }
    }
  };

  const selectVersion = (version: ContentVersion) => {
    form.setValue(fieldName as string, version.content);
    setActiveVersionId(version.id);
  };

  const clearAllVersions = () => {
    const currentContent = form.getValues(fieldName as string) || "";
    
    // Create a single version with current content
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: currentContent,
      timestamp: new Date().toISOString(),
      source: "manual"
    };
    
    setVersions([newVersion]);
    form.setValue(versionsFieldName as string, [newVersion]);
    setActiveVersionId(newVersion.id);
  };

  const addNewVersion = (content: string, source: "manual" | "ai" | "import" = "manual") => {
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      source
    };
    
    const updatedVersions = [...versions, newVersion];
    setVersions(updatedVersions);
    form.setValue(versionsFieldName as string, updatedVersions);
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
