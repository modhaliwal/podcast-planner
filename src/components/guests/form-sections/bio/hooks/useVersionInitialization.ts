
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { findHighestVersionNumber } from "@/hooks/versions";
import { useEffect } from "react";

interface UseVersionInitializationProps {
  content: string;
  versions: ContentVersion[];
  setVersions: (versions: ContentVersion[]) => void;
  setActiveVersionId: (id: string | null) => void;
}

export function useVersionInitialization({
  content,
  versions,
  setVersions,
  setActiveVersionId
}: UseVersionInitializationProps) {
  // Using useEffect with empty dependency array to run only once
  useEffect(() => {
    const timer = setTimeout(() => {
      if (versions.length === 0 && content) {
        // Create initial version based on current content
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: content,
          timestamp: new Date().toISOString(),
          source: "import",
          active: true,
          versionNumber: 1
        };
        
        setVersions([initialVersion]);
        setActiveVersionId(initialVersion.id);
      } else if (versions.length > 0) {
        // Find the active version
        const activeVersion = versions.find(v => v.active);
        
        if (activeVersion) {
          setActiveVersionId(activeVersion.id);
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
            
            setVersions(updatedVersions);
            setActiveVersionId(sortedVersions[0].id);
          }
        }
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []); // Run once on mount only
  
  return {};
}
