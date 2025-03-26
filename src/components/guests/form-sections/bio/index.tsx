
import { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ContentVersion } from "@/lib/types";
import { VersionManager } from "../background-research/VersionManager";
import { BioGeneration } from "./BioGeneration";
import { BioEditor } from "./BioEditor";

interface BioSectionProps {
  form: UseFormReturn<any>;
  bioVersions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
}

export function BioSection({ form, bioVersions = [], onVersionsChange }: BioSectionProps) {
  // Get the current bio content from the form
  const [bio, setBio] = useState<string>(form.getValues('bio') || '');
  
  // Update local state when form value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'bio') {
        setBio(value.bio as string);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Use the version manager to handle version control
  const {
    activeVersionId,
    handleEditorBlur,
    addAIVersion,
    versionSelectorProps
  } = VersionManager({
    content: bio,
    versions: bioVersions,
    onVersionsChange: onVersionsChange,
    onContentChange: (newContent) => {
      form.setValue('bio', newContent);
      setBio(newContent);
    }
  });
  
  const handleBioChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    handleEditorBlur();
  };
  
  const handleNewVersionCreated = (version: ContentVersion) => {
    form.setValue('bio', version.content);
    addAIVersion(version.content);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Bio</FormLabel>
        <div className="flex space-x-2">
          {bioVersions.length > 0 && versionSelectorProps.versions.length > 0 && (
            <div className="flex items-center">
              <VersionSelector {...versionSelectorProps} />
            </div>
          )}
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

// Importing the VersionSelector to avoid circular dependency issues
import { VersionSelector } from "../VersionSelector";
