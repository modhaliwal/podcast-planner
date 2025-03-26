
import { useState, useEffect, useRef } from "react";
import { FormLabel } from "@/components/ui/form";
import { Guest, ContentVersion } from "@/lib/types";
import { useMarkdownParser } from "@/hooks/useMarkdownParser";
import { v4 as uuidv4 } from "uuid";
import { BackgroundResearchEditor } from "./BackgroundResearchEditor";
import { BackgroundResearchControls } from "./BackgroundResearchControls";
import { generateBackgroundResearch } from "./BackgroundResearchGenerator";

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
  const [isLoading, setIsLoading] = useState(false);
  const [markdownToConvert, setMarkdownToConvert] = useState<string | undefined>();
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  const parsedHtml = useMarkdownParser(markdownToConvert);

  // Initialize with the current research as the first version if no versions exist
  useEffect(() => {
    if (backgroundResearchVersions.length === 0 && backgroundResearch) {
      const initialVersion: ContentVersion = {
        id: uuidv4(),
        content: backgroundResearch,
        timestamp: new Date().toISOString(),
        source: 'manual'
      };
      onVersionsChange([initialVersion]);
      setActiveVersionId(initialVersion.id);
    } else if (!activeVersionId && backgroundResearchVersions.length > 0) {
      // Set the most recent version as active
      const sortedVersions = [...backgroundResearchVersions].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActiveVersionId(sortedVersions[0].id);
    }
  }, [backgroundResearchVersions, backgroundResearch, onVersionsChange, activeVersionId]);

  // Update background research when parsedHtml changes
  useEffect(() => {
    if (parsedHtml) {
      // Save current version
      saveCurrentVersion('manual');
      
      // Update content
      setBackgroundResearch(parsedHtml);
      
      // Save as new AI version
      saveCurrentVersion('ai');
      
      setMarkdownToConvert(undefined); // Reset after conversion
    }
  }, [parsedHtml]);

  const handleChange = (content: string) => {
    console.log("Background research changed:", content);
    setBackgroundResearch(content);
  };

  const selectVersion = (version: ContentVersion) => {
    setBackgroundResearch(version.content);
    setActiveVersionId(version.id);
  };

  const saveCurrentVersion = (source: ContentVersion['source'] = 'manual') => {
    // Don't save empty content
    if (!backgroundResearch.trim()) return;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: backgroundResearch,
      timestamp: new Date().toISOString(),
      source
    };
    
    // Add the new version and update the active version
    const updatedVersions = [...backgroundResearchVersions, newVersion];
    onVersionsChange(updatedVersions);
    setActiveVersionId(newVersion.id);
    
    return newVersion;
  };

  // Handle editor blur to create a version
  const handleEditorBlur = () => {
    const activeVersion = backgroundResearchVersions.find(v => v.id === activeVersionId);
    
    if (activeVersion && activeVersion.content !== backgroundResearch) {
      saveCurrentVersion('manual');
    }
  };

  const handleGenerateResearch = async () => {
    if (guest) {
      await generateBackgroundResearch(guest, setIsLoading, setMarkdownToConvert);
      // Save the current version before updating
      saveCurrentVersion('manual');
    }
  };

  return (
    <div className="space-y-4">
      <BackgroundResearchControls 
        versions={backgroundResearchVersions}
        onSelectVersion={selectVersion}
        activeVersionId={activeVersionId}
        onGenerateResearch={handleGenerateResearch}
        isGenerating={isLoading}
      />
      <BackgroundResearchEditor 
        backgroundResearch={backgroundResearch}
        onChangeBackgroundResearch={handleChange}
        onBlur={handleEditorBlur}
      />
    </div>
  );
}
