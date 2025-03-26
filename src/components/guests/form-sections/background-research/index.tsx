import { useState, useEffect } from "react";
import { FormLabel } from "@/components/ui/form";
import { Guest, ContentVersion } from "@/lib/types";
import { useMarkdownParser } from "@/hooks/useMarkdownParser";
import { v4 as uuidv4 } from "uuid";
import { BackgroundResearchEditor } from "./BackgroundResearchEditor";
import { BackgroundResearchControls } from "./BackgroundResearchControls";
import { generateBackgroundResearch } from "./BackgroundResearchGenerator";
import { useAIPrompts } from "@/hooks/useAIPrompts";

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
  const [previousContent, setPreviousContent] = useState<string>("");
  const [hasChangedSinceLastSave, setHasChangedSinceLastSave] = useState<boolean>(false);
  const [versionCreatedSinceFormOpen, setVersionCreatedSinceFormOpen] = useState<boolean>(false);
  const parsedHtml = useMarkdownParser(markdownToConvert);
  const { getPromptByKey } = useAIPrompts();

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
      setPreviousContent(backgroundResearch);
    } else if (!activeVersionId && backgroundResearchVersions.length > 0) {
      const sortedVersions = [...backgroundResearchVersions].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActiveVersionId(sortedVersions[0].id);
      setPreviousContent(sortedVersions[0].content);
    }
  }, [backgroundResearchVersions, backgroundResearch, onVersionsChange, activeVersionId]);

  useEffect(() => {
    if (parsedHtml) {
      setBackgroundResearch(parsedHtml);
      
      const newVersion: ContentVersion = {
        id: uuidv4(),
        content: parsedHtml,
        timestamp: new Date().toISOString(),
        source: 'ai'
      };
      
      const updatedVersions = [...backgroundResearchVersions, newVersion];
      onVersionsChange(updatedVersions);
      setActiveVersionId(newVersion.id);
      setPreviousContent(parsedHtml);
      setHasChangedSinceLastSave(false);
      setVersionCreatedSinceFormOpen(true);
      
      setMarkdownToConvert(undefined);
    }
  }, [parsedHtml]);

  useEffect(() => {
    if (backgroundResearch !== previousContent) {
      setHasChangedSinceLastSave(true);
    }
  }, [backgroundResearch, previousContent]);

  const handleChange = (content: string) => {
    setBackgroundResearch(content);
  };

  const selectVersion = (version: ContentVersion) => {
    setActiveVersionId(version.id);
    setBackgroundResearch(version.content);
    setPreviousContent(version.content);
    setHasChangedSinceLastSave(false);
  };

  const saveCurrentVersion = () => {
    if (!backgroundResearch.trim()) return;
    if (backgroundResearch === previousContent) return;
    if (versionCreatedSinceFormOpen) return;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: backgroundResearch,
      timestamp: new Date().toISOString(),
      source: 'manual'
    };
    
    const updatedVersions = [...backgroundResearchVersions, newVersion];
    onVersionsChange(updatedVersions);
    setActiveVersionId(newVersion.id);
    setPreviousContent(backgroundResearch);
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(true);
    
    return newVersion;
  };

  const handleEditorBlur = () => {
    if (hasChangedSinceLastSave && backgroundResearch !== previousContent && backgroundResearch.trim() && !versionCreatedSinceFormOpen) {
      saveCurrentVersion();
    }
  };

  const handleGenerateResearch = async () => {
    if (guest) {
      setIsLoading(true);
      try {
        await generateBackgroundResearch(
          guest, 
          setIsLoading, 
          setMarkdownToConvert,
          getPromptByKey
        );
      } catch (error) {
        console.error("Error generating research:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <BackgroundResearchControls 
        guest={guest || { id: '', name: '', title: '', bio: '', socialLinks: {}, createdAt: '', updatedAt: '' }}
        onNewVersionCreated={saveCurrentVersion}
        onClearAllVersions={() => onVersionsChange([])}
        setMarkdownToConvert={setMarkdownToConvert}
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
