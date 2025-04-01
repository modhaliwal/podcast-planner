
import { useState, useEffect } from "react";
import { Guest, ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// Ensure version numbers are set correctly
const ensureVersionNumbers = (versions: ContentVersion[]): ContentVersion[] => {
  if (!versions || !Array.isArray(versions) || versions.length === 0) {
    return [];
  }
  
  // Sort by timestamp (oldest first)
  const sortedVersions = [...versions].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Ensure each version has a sequential version number
  return sortedVersions.map((version, index) => ({
    ...version,
    versionNumber: index + 1
  }));
};

interface GuestFormVersionsStateProps {
  guest: Guest;
  children: (state: {
    backgroundResearchVersions: ContentVersion[];
    notes: string;
    backgroundResearch: string;
    setBackgroundResearchVersions: (versions: ContentVersion[]) => void;
    setNotes: (notes: string) => void;
    setBackgroundResearch: (research: string) => void;
  }) => React.ReactNode;
}

export function GuestFormVersionsState({ guest, children }: GuestFormVersionsStateProps) {
  const [notes, setNotes] = useState(guest.notes || "");
  const [backgroundResearch, setBackgroundResearch] = useState(guest.backgroundResearch || "");
  const [backgroundResearchVersions, setBackgroundResearchVersions] = useState<ContentVersion[]>(
    ensureVersionNumbers(guest.backgroundResearchVersions || [])
  );

  // Initialize versions if they don't exist
  useEffect(() => {
    if (backgroundResearchVersions.length === 0 && guest.backgroundResearch) {
      const initialVersion: ContentVersion = {
        id: uuidv4(),
        content: guest.backgroundResearch,
        timestamp: guest.updatedAt || new Date().toISOString(),
        source: 'import',
        active: true,
        versionNumber: 1
      };
      setBackgroundResearchVersions([initialVersion]);
    }
  }, [guest, backgroundResearchVersions.length]);

  return (
    <>
      {children({
        backgroundResearchVersions,
        notes,
        backgroundResearch,
        setBackgroundResearchVersions,
        setNotes,
        setBackgroundResearch
      })}
    </>
  );
}
