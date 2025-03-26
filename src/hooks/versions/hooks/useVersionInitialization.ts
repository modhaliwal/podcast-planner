
import { useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { findHighestVersionNumber } from "../utils/versionNumberUtils";
import { processVersions } from "@/lib/versionUtils";

/**
 * Hook that handles the initialization of version state
 */
export function useVersionInitialization(
  content: string,
  versions: ContentVersion[],
  onVersionsChange: (versions: ContentVersion[]) => void,
  onContentChange: (content: string) => void
) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [previousContent, setPreviousContent] = useState<string>(content);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize versions on component mount or when versions/content change
  useEffect(() => {
    if (hasInitialized) return;
    
    // Process versions to ensure they're valid
    const processedVersions = processVersions(versions);
    
    if (processedVersions.length === 0 && content) {
      // Create initial version if none exists
      const initialVersion: ContentVersion = {
        id: uuidv4(),
        content: content,
        timestamp: new Date().toISOString(),
        source: "manual",
        active: true,
        versionNumber: 1
      };
      
      onVersionsChange([initialVersion]);
      setActiveVersionId(initialVersion.id);
      setPreviousContent(content);
    } else if (processedVersions.length > 0) {
      // Find the active version
      const activeVersion = processedVersions.find(v => v.active);
      
      if (activeVersion) {
        setActiveVersionId(activeVersion.id);
        
        // Only update content if it's different to avoid render loops
        if (content !== activeVersion.content) {
          onContentChange(activeVersion.content);
        }
        setPreviousContent(activeVersion.content);
      } else {
        // If no version is marked as active, use the most recent one
        const sortedVersions = [...processedVersions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        if (sortedVersions.length > 0) {
          const updatedVersions = processedVersions.map(v => ({
            ...v,
            active: v.id === sortedVersions[0].id
          }));
          
          onVersionsChange(updatedVersions);
          setActiveVersionId(sortedVersions[0].id);
          setPreviousContent(sortedVersions[0].content);
          if (content !== sortedVersions[0].content) {
            onContentChange(sortedVersions[0].content);
          }
        }
      }
      
      // If the versions array was updated by processing, update it
      if (JSON.stringify(processedVersions) !== JSON.stringify(versions)) {
        onVersionsChange(processedVersions);
      }
    }
    
    setHasInitialized(true);
  }, [hasInitialized, versions, content, onVersionsChange, onContentChange]);

  return {
    activeVersionId,
    setActiveVersionId,
    previousContent,
    setPreviousContent,
    hasInitialized
  };
}
