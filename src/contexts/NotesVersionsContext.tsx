
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ContentVersion } from "@/lib/types";

// Define the context value type
interface NotesVersionsContextValue {
  activeVersionId: string | null;
  versions: ContentVersion[];
  handleContentChange: () => void;
  selectVersion: (version: ContentVersion) => void;
  clearAllVersions: () => void;
  addNewVersion: (content: string, source?: "manual" | "ai" | "import") => ContentVersion;
  versionSelectorProps: {
    versions: ContentVersion[];
    onSelectVersion: (version: ContentVersion) => void;
    activeVersionId: string | undefined;
    onClearAllVersions: () => void;
  };
}

// Create the context with a default undefined value
const NotesVersionsContext = createContext<NotesVersionsContextValue | undefined>(undefined);

// Define props for the provider
interface NotesVersionsProviderProps {
  children: ReactNode;
  form: UseFormReturn<any>;
  fieldName: string;
  versionsFieldName: string;
}

export function NotesVersionsProvider({
  children,
  form,
  fieldName,
  versionsFieldName,
}: NotesVersionsProviderProps) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  // Initialize versions if they don't exist - only run once
  useEffect(() => {
    if (!hasInitialized) {
      const currentContent = form.getValues(fieldName) || "";
      const existingVersions = form.getValues(versionsFieldName) || [];

      if (existingVersions.length === 0 && currentContent) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentContent,
          timestamp: new Date().toISOString(),
          source: "manual",
        };
        
        // Update both the local state and the form value
        setVersions([initialVersion]);
        form.setValue(versionsFieldName, [initialVersion], { shouldDirty: false });
        setActiveVersionId(initialVersion.id);
      } else if (existingVersions.length > 0) {
        // Set to the most recent version
        const sortedVersions = [...existingVersions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setVersions(sortedVersions);
        
        // Find a version that's marked as active or use the most recent one
        const activeVersion = sortedVersions.find(v => v.active === true) || sortedVersions[0];
        setActiveVersionId(activeVersion.id);
        
        // Make sure the form content matches the active version
        form.setValue(fieldName, activeVersion.content, { shouldDirty: false });
      }
      
      setHasInitialized(true);
    }
  }, [form, fieldName, versionsFieldName, hasInitialized]);

  // Memoize these functions to prevent unnecessary re-renders
  const handleContentChange = useCallback(() => {
    const currentContent = form.getValues(fieldName) || "";
    
    // Check if content is not empty and if we have an active version to compare with
    if (typeof currentContent === 'string' && currentContent.trim() && activeVersionId) {
      const activeVersion = versions.find(v => v.id === activeVersionId);
      
      // Only create a new version if content has changed
      if (activeVersion && currentContent !== activeVersion.content) {
        const newVersion: ContentVersion = {
          id: uuidv4(),
          content: currentContent,
          timestamp: new Date().toISOString(),
          source: "manual",
          active: true
        };
        
        // Update active status in all versions
        const updatedVersions = versions.map(v => ({
          ...v,
          active: false // Set all existing versions as inactive
        }));
        
        // Add the new active version
        const finalVersions = [...updatedVersions, newVersion];
        setVersions(finalVersions);
        form.setValue(versionsFieldName, finalVersions, { shouldDirty: true });
        setActiveVersionId(newVersion.id);
      }
    }
  }, [activeVersionId, versions, form, fieldName, versionsFieldName]);

  const selectVersion = useCallback((version: ContentVersion) => {
    // Update form content to match selected version
    form.setValue(fieldName, version.content, { shouldDirty: false });
    
    // Update active status in all versions
    const updatedVersions = versions.map(v => ({
      ...v,
      active: v.id === version.id
    }));
    
    // Update form and state
    setVersions(updatedVersions);
    form.setValue(versionsFieldName, updatedVersions, { shouldDirty: true });
    setActiveVersionId(version.id);
  }, [form, fieldName, versionsFieldName, versions]);

  const clearAllVersions = useCallback(() => {
    const currentContent = form.getValues(fieldName) || "";
    
    // Create a single version with current content
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: typeof currentContent === 'string' ? currentContent : '',
      timestamp: new Date().toISOString(),
      source: "manual",
      active: true
    };
    
    setVersions([newVersion]);
    form.setValue(versionsFieldName, [newVersion], { shouldDirty: true });
    setActiveVersionId(newVersion.id);
  }, [form, fieldName, versionsFieldName]);

  const addNewVersion = useCallback((content: string, source: "manual" | "ai" | "import" = "manual") => {
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
    form.setValue(versionsFieldName, finalVersions, { shouldDirty: true });
    setActiveVersionId(newVersion.id);
    
    return newVersion;
  }, [versions, form, versionsFieldName]);

  // For version selector dropdown - memoized to prevent re-renders
  const versionSelectorProps = {
    versions,
    onSelectVersion: selectVersion,
    activeVersionId: activeVersionId || undefined,
    onClearAllVersions: clearAllVersions
  };

  const contextValue: NotesVersionsContextValue = {
    activeVersionId,
    versions,
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion,
    versionSelectorProps
  };

  return (
    <NotesVersionsContext.Provider value={contextValue}>
      {children}
    </NotesVersionsContext.Provider>
  );
}

// Custom hook for consuming the context
export function useNotesVersions() {
  const context = useContext(NotesVersionsContext);
  if (context === undefined) {
    throw new Error("useNotesVersions must be used within a NotesVersionsProvider");
  }
  return context;
}
