
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
      }
    } else if (!activeVersionId) {
      // Set the most recent version as active
      const sortedVersions = [...bioVersions].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActiveVersionId(sortedVersions[0].id);
    }
  }, [bioVersions, form, onVersionsChange, activeVersionId]);

  const selectVersion = (version: ContentVersion) => {
    form.setValue('bio', version.content);
    setActiveVersionId(version.id);
  };

  const saveCurrentVersion = (source: ContentVersion['source'] = 'manual') => {
    const currentBio = form.getValues('bio');
    
    // Don't save empty content
    if (!currentBio.trim()) return;
    
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
    
    return newVersion;
  };

  // Handle bio change from text area to create a version
  const handleBioChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    // When the textarea loses focus, save the current version if it's different from the active version
    const currentBio = event.target.value;
    const activeVersion = bioVersions.find(v => v.id === activeVersionId);
    
    if (activeVersion && activeVersion.content !== currentBio) {
      saveCurrentVersion('manual');
    }
  };

  const handleNewVersionCreated = (version: ContentVersion) => {
    const updatedVersions = [...bioVersions, version];
    onVersionsChange(updatedVersions);
    setActiveVersionId(version.id);
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
