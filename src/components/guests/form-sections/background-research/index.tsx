
import { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form";
import { Guest, ContentVersion } from "@/lib/types";
import { BackgroundResearchEditor } from "./BackgroundResearchEditor";
import { VersionSelector } from "../VersionSelector";
import { BackgroundResearchGenerator } from "./BackgroundResearchGenerator";
import { useVersionManager } from "@/hooks/versions";
import { useForm } from "react-hook-form";

interface BackgroundResearchSectionProps {
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  backgroundResearchVersions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  guest?: Guest;
}

export function BackgroundResearchSection({ 
  backgroundResearch, 
  setBackgroundResearch,
  backgroundResearchVersions = [],
  onVersionsChange,
  guest
}: BackgroundResearchSectionProps) {
  // Create a form instance for the research generator
  const form = useForm({
    defaultValues: {
      backgroundResearch: backgroundResearch || "",
      name: guest?.name || "",
      title: guest?.title || "",
      company: guest?.company || ""
    }
  });
  
  // Use the version manager to handle version control
  const {
    activeVersionId,
    handleEditorBlur,
    addAIVersion,
    selectVersion,
    clearAllVersions,
    versionSelectorProps
  } = useVersionManager({
    content: backgroundResearch,
    versions: backgroundResearchVersions,
    onVersionsChange,
    onContentChange: setBackgroundResearch
  });

  const handleChange = (content: string) => {
    setBackgroundResearch(content);
  };

  const handleGenerationComplete = (html: string) => {
    // The html is already converted on the server side
    setBackgroundResearch(html);
    addAIVersion(html);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Background Research</FormLabel>
        <div className="flex items-center gap-2">
          {backgroundResearchVersions.length > 0 && (
            <VersionSelector {...versionSelectorProps} />
          )}
          <BackgroundResearchGenerator 
            guest={guest} 
            onGenerationComplete={handleGenerationComplete}
            form={form}
          />
        </div>
      </div>
      
      <BackgroundResearchEditor 
        backgroundResearch={backgroundResearch}
        onChangeBackgroundResearch={handleChange}
        onBlur={handleEditorBlur}
      />
    </div>
  );
}
