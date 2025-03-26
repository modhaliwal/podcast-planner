
import { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ContentVersion } from "@/lib/types";
import { VersionSelector } from "../VersionSelector";
import { BioGeneration } from "./BioGeneration";
import { BioEditor } from "./BioEditor";
import { useVersionManager } from "@/hooks/versions";
import { Button } from "@/components/ui/button";

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
  
  // Handle content changes without directly updating form in the render
  const handleContentChange = (newContent: string) => {
    setBio(newContent);
    form.setValue('bio', newContent, { shouldDirty: true });
  };
  
  // Use the version manager to handle version control
  const {
    activeVersionId,
    handleEditorBlur,
    addAIVersion,
    selectVersion,
    clearAllVersions,
    versionSelectorProps
  } = useVersionManager({
    content: bio,
    versions: bioVersions,
    onVersionsChange,
    onContentChange: handleContentChange
  });
  
  const handleBioChange = () => {
    handleEditorBlur();
  };
  
  const handleNewVersionCreated = (content: string) => {
    handleContentChange(content);
    addAIVersion(content);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Bio</FormLabel>
        <div className="flex space-x-2">
          {bioVersions.length > 0 && (
            <VersionSelector {...versionSelectorProps} />
          )}
          <BioGeneration 
            form={form}
            bio={bio}
            setBio={handleNewVersionCreated}
            versions={bioVersions}
            onVersionsChange={onVersionsChange}
          />
        </div>
      </div>
      
      <BioEditor 
        form={form} 
        activeVersionId={activeVersionId || undefined}
        onBioChange={handleBioChange}
      />
    </div>
  );
}
