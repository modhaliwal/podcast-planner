
import { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form";
import { Guest, ContentVersion } from "@/lib/types";
import { useMarkdownParser } from "@/hooks/useMarkdownParser";
import { BackgroundResearchEditor } from "./BackgroundResearchEditor";
import { VersionSelector } from "../VersionSelector";
import { VersionHistory } from "../VersionHistory";
import { AIResearchGenerator } from "./AIResearchGenerator";
import { useVersionManager } from "@/hooks/versions";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

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
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [markdownToConvert, setMarkdownToConvert] = useState<string | undefined>();
  const parsedHtml = useMarkdownParser(markdownToConvert);
  
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

  // Handle markdown conversion
  useEffect(() => {
    if (parsedHtml) {
      setBackgroundResearch(parsedHtml);
      addAIVersion(parsedHtml);
      setMarkdownToConvert(undefined);
    }
  }, [parsedHtml, setBackgroundResearch, addAIVersion]);

  const handleChange = (content: string) => {
    setBackgroundResearch(content);
  };

  const handleGenerationComplete = (markdown: string) => {
    setMarkdownToConvert(markdown);
  };

  const toggleVersionHistory = () => {
    setShowVersionHistory(!showVersionHistory);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Background Research</FormLabel>
        <div className="flex space-x-2">
          {backgroundResearchVersions.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleVersionHistory}
              className="flex items-center gap-1"
            >
              Version History
            </Button>
          )}
          <AIResearchGenerator 
            guest={guest} 
            onGenerationComplete={handleGenerationComplete}
            form={form}
          />
        </div>
      </div>
      
      {showVersionHistory && backgroundResearchVersions.length > 0 && (
        <VersionHistory 
          versions={backgroundResearchVersions}
          onSelectVersion={selectVersion}
          activeVersionId={activeVersionId || undefined}
          onClearAllVersions={clearAllVersions}
        />
      )}
      
      <BackgroundResearchEditor 
        backgroundResearch={backgroundResearch}
        onChangeBackgroundResearch={handleChange}
        onBlur={handleEditorBlur}
      />
    </div>
  );
}
