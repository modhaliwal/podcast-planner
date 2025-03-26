
import { useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Hook to handle initialization of versions
 */
export function useVersionInitialization(
  content: string,
  versions: ContentVersion[],
  onVersionsChange: (versions: ContentVersion[]) => void,
  onContentChange: (content: string) => void
) {
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  const [previousContent, setPreviousContent] = useState<string>("");
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Ensure all versions have version numbers and active flag
  useEffect(() => {
    if (!versions.length || hasInitialized) return;
    
    const needsUpdate = versions.some(v => 
      v.versionNumber === undefined || v.active === undefined
    );
    
    if (needsUpdate) {
      // Sort versions by timestamp (oldest first)
      const sortedVersions = [...versions].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      // Add sequential version numbers and ensure active flag exists
      const versionsWithUpdates = sortedVersions.map((v, index) => ({
        ...v,
        versionNumber: v.versionNumber || (index + 1),
        active: v.active || false
      }));
      
      onVersionsChange(versionsWithUpdates);
    }
    
    setHasInitialized(true);
  }, [versions, onVersionsChange, hasInitialized]);

  // Initialize the active version and content (separate effect to avoid race conditions)
  useEffect(() => {
    if (hasInitialized || !versions.length) return;
    
    // Wait for the next tick to avoid render loops
    const timer = setTimeout(() => {
      if (versions.length === 0 && content) {
        // Create initial version if none exists
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: content,
          timestamp: new Date().toISOString(),
          source: 'manual',
          active: true,
          versionNumber: 1
        };
        onVersionsChange([initialVersion]);
        setActiveVersionId(initialVersion.id);
        setPreviousContent(content);
      } else if (!activeVersionId && versions.length > 0) {
        // Find active version or use the most recent one
        const activeVersion = versions.find(v => v.active === true);
        
        if (activeVersion) {
          setActiveVersionId(activeVersion.id);
          setPreviousContent(activeVersion.content);
          if (content !== activeVersion.content) {
            onContentChange(activeVersion.content);
          }
        } else {
          // If no active version, use the most recent one and mark it as active
          const sortedVersions = [...versions].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          // Update all versions to set the first one as active
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
    }, 0);
    
    return () => clearTimeout(timer);
  }, [versions, content, onVersionsChange, activeVersionId, onContentChange, hasInitialized]);

  return {
    activeVersionId,
    setActiveVersionId,
    previousContent,
    setPreviousContent
  };
}
