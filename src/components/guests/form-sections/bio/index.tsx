import { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ContentVersion } from "@/lib/types";
import { VersionSelector } from "../VersionSelector";
import { BioGeneration } from "./BioGeneration";
import { BioEditor } from "./BioEditor";

interface BioSectionProps {
  form: UseFormReturn<any>;
  bioVersions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
}

export function BioSection({ form, bioVersions = [], onVersionsChange }: BioSectionProps) {
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  const [previousContent, setPreviousContent] = useState<string>("");
  const [hasChangedSinceLastSave, setHasChangedSinceLastSave] = useState<boolean>(false);
  const [versionCreatedSinceFormOpen, setVersionCreatedSinceFormOpen] = useState<boolean>(false);

  // Initialize with the current bio as the first version if no versions exist
  useEffect(() => {
    if (bioVersions.length === 0) {
      const currentBio = form.getValues('bio');
      if (currentBio) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentBio,
          timestamp: new Date().toISOString(),
          source: 'manual'
        };
        onVersionsChange([initialVersion]);
        setActiveVersionId(initialVersion.id);
        setPreviousContent(currentBio);
      }
    } else if (!activeVersionId) {
      // Set the most recent version as active
      const sortedVersions = [...bioVersions].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActiveVersionId(sortedVersions[0].id);
      setPreviousContent(sortedVersions[0].content);
    }
  }, [bioVersions, form, onVersionsChange, activeVersionId]);

  const selectVersion = (version: ContentVersion) => {
    form.setValue('bio', version.content);
    setActiveVersionId(version.id);
    setPreviousContent(version.content);
    setHasChangedSinceLastSave(false);
  };

  const saveCurrentVersion = (source: ContentVersion['source'] = 'manual') => {
    const currentBio = form.getValues('bio');
    
    // Don't save empty content
    if (!currentBio.trim()) return;
    
    // Only save if content has actually changed from the previous version
    if (currentBio === previousContent) return;
    
    // Only create one version per edit session
    if (versionCreatedSinceFormOpen) return;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: currentBio,
      timestamp: new Date().toISOString(),
      source
    };
    
    // Add the new version and update the active version
    const updatedVersions = [...bioVersions, newVersion];
    onVersionsChange(updatedVersions);
    setActiveVersionId(newVersion.id);
    setPreviousContent(currentBio);
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(true);
    
    return newVersion;
  };

  const handleClearAllVersions = () => {
    // Keep only the active version
    const currentBio = form.getValues('bio');
    
    // Find the active version
    const activeVersion = bioVersions.find(v => v.id === activeVersionId);
    
    if (activeVersion) {
      // Keep only the active version
      onVersionsChange([activeVersion]);
    } else {
      // If no active version found, create a new version with current content
      onVersionsChange([]);
      if (currentBio.trim()) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentBio,
          timestamp: new Date().toISOString(),
          source: 'manual'
        };
        onVersionsChange([initialVersion]);
        setActiveVersionId(initialVersion.id);
        setPreviousContent(currentBio);
      }
    }
    
    // Reset states
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(false);
  };

  // Track when content changes in the form
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'bio') {
        const currentValue = value.bio as string;
        if (currentValue !== previousContent) {
          setHasChangedSinceLastSave(true);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, previousContent]);

  // Handle bio change from text area to create a version
  const handleBioChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    // When the textarea loses focus, save the current version if it's different from the saved version
    // and we haven't already saved it (hasChangedSinceLastSave is true)
    if (hasChangedSinceLastSave) {
      const currentBio = event.target.value;
      
      // Only create a new version if the content has actually changed
      if (currentBio !== previousContent && currentBio.trim() && !versionCreatedSinceFormOpen) {
        saveCurrentVersion('manual');
      }
    }
  };

  const handleNewVersionCreated = (version: ContentVersion) => {
    const updatedVersions = [...bioVersions, version];
    onVersionsChange(updatedVersions);
    setActiveVersionId(version.id);
    setPreviousContent(version.content);
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Bio</FormLabel>
        <div className="flex space-x-2">
          <VersionSelector 
            versions={bioVersions} 
            onSelectVersion={selectVersion} 
            activeVersionId={activeVersionId}
            onClearAllVersions={handleClearAllVersions}
          />
          <BioGeneration 
            form={form} 
            onNewVersionCreated={handleNewVersionCreated}
          />
        </div>
      </div>
      <BioEditor 
        form={form} 
        activeVersionId={activeVersionId}
        onBioChange={handleBioChange}
      />
    </div>
  );
}
