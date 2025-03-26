
import { useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { UseFormReturn } from "react-hook-form";
import { EpisodeFormValues } from "@/components/episodes/EpisodeFormSchema";

interface UseNotesVersionManagerProps {
  form: UseFormReturn<EpisodeFormValues>;
  fieldName: string;
  versionsFieldName: string;
}

export function useNotesVersionManager({
  form,
  fieldName,
  versionsFieldName
}: UseNotesVersionManagerProps) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  // Initialize versions if they don't exist
  useEffect(() => {
    if (!hasInitialized) {
      const currentNotes = form.getValues(fieldName) || "";
      const existingVersions = form.getValues(versionsFieldName) || [];

      if (existingVersions.length === 0 && currentNotes) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentNotes,
          timestamp: new Date().toISOString(),
          source: "manual",
        };
        
        // Update both the local state and the form value
        setVersions([initialVersion]);
        form.setValue(versionsFieldName, [initialVersion]);
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

  const handleEditorBlur = () => {
    const currentContent = form.getValues(fieldName) || "";
    
    // Check if content is not empty and if we have an active version to compare with
    if (currentContent.trim() && activeVersionId) {
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
        form.setValue(versionsFieldName, updatedVersions);
        setActiveVersionId(newVersion.id);
      }
    }
  };

  const selectVersion = (version: ContentVersion) => {
    form.setValue(fieldName, version.content);
    setActiveVersionId(version.id);
  };

  const handleClearAllVersions = () => {
    const currentContent = form.getValues(fieldName) || "";
    
    // Create a single version with current content
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: currentContent,
      timestamp: new Date().toISOString(),
      source: "manual"
    };
    
    setVersions([newVersion]);
    form.setValue(versionsFieldName, [newVersion]);
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
    form.setValue(versionsFieldName, updatedVersions);
    setActiveVersionId(newVersion.id);
    
    return newVersion;
  };

  return {
    activeVersionId,
    versions,
    handleEditorBlur,
    selectVersion,
    handleClearAllVersions,
    addNewVersion
  };
}
