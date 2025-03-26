
import { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ContentVersion } from "@/lib/types";
import { VersionSelector } from "../VersionSelector";
import { VersionHistory } from "../VersionHistory";
import { BioGeneration } from "./BioGeneration";
import { BioEditor } from "./BioEditor";
import { useVersionManager } from "@/hooks/versions";

interface BioSectionProps {
  form: UseFormReturn<any>;
  bioVersions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
}

export function BioSection({ form, bioVersions = [], onVersionsChange }: BioSectionProps) {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
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

  const toggleVersionHistory = () => {
    setShowVersionHistory(!showVersionHistory);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Bio</FormLabel>
        <div className="flex space-x-2">
          {bioVersions.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleVersionHistory}
              className="flex items-center gap-1"
            >
              Version History
            </Button>
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
      
      {showVersionHistory && bioVersions.length > 0 && (
        <VersionHistory 
          versions={bioVersions}
          onSelectVersion={selectVersion}
          activeVersionId={activeVersionId || undefined}
          onClearAllVersions={clearAllVersions}
        />
      )}
      
      <BioEditor 
        form={form} 
        activeVersionId={activeVersionId || undefined}
        onBioChange={handleBioChange}
      />
    </div>
  );
}
