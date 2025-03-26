
import { useState, useEffect, useCallback } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { findHighestVersionNumber } from "../utils/versionNumberUtils";

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

  // Initialize versions on component mount
  useEffect(() => {
    if (hasInitialized) return;
    
    const timer = setTimeout(() => {
      if (versions.length === 0 && content) {
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
      } else if (versions.length > 0) {
        // Find the active version
        const activeVersion = versions.find(v => v.active);
        
        if (activeVersion) {
          setActiveVersionId(activeVersion.id);
          
          // Only update content if it's different to avoid render loops
          if (content !== activeVersion.content) {
            onContentChange(activeVersion.content);
          }
          setPreviousContent(activeVersion.content);
        } else {
          // If no version is marked as active, use the most recent one
          const sortedVersions = [...versions].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          if (sortedVersions.length > 0) {
            const updatedVersions = versions.map(v => ({
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
      }
      
      setHasInitialized(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [hasInitialized, versions, content, onVersionsChange, onContentChange]);

  return {
    activeVersionId,
    setActiveVersionId,
    previousContent,
    setPreviousContent,
    hasInitialized
  };
}
