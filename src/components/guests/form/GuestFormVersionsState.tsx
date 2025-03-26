
import { useState, useEffect } from "react";
import { Guest, ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { ensureVersionNumbers } from "@/hooks/versions";

interface GuestFormVersionsStateProps {
  guest: Guest;
  children: (state: {
    bioVersions: ContentVersion[];
    backgroundResearchVersions: ContentVersion[];
    notes: string;
    backgroundResearch: string;
    setBioVersions: (versions: ContentVersion[]) => void;
    setBackgroundResearchVersions: (versions: ContentVersion[]) => void;
    setNotes: (notes: string) => void;
    setBackgroundResearch: (research: string) => void;
  }) => React.ReactNode;
}

export function GuestFormVersionsState({ guest, children }: GuestFormVersionsStateProps) {
  const [notes, setNotes] = useState(guest.notes || "");
  const [backgroundResearch, setBackgroundResearch] = useState(guest.backgroundResearch || "");
  const [bioVersions, setBioVersions] = useState<ContentVersion[]>(
    ensureVersionNumbers(guest.bioVersions || [])
  );
  const [backgroundResearchVersions, setBackgroundResearchVersions] = useState<ContentVersion[]>(
    ensureVersionNumbers(guest.backgroundResearchVersions || [])
  );

  // Initialize versions if they don't exist
  useEffect(() => {
    const initializeVersions = () => {
      if (bioVersions.length === 0 && guest.bio) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: guest.bio,
          timestamp: guest.updatedAt || new Date().toISOString(),
          source: 'import',
          active: true,
          versionNumber: 1
        };
        setBioVersions([initialVersion]);
      }
  
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
    };

    initializeVersions();
  }, [guest, bioVersions.length, backgroundResearchVersions.length]);

  return (
    <>
      {children({
        bioVersions,
        backgroundResearchVersions,
        notes,
        backgroundResearch,
        setBioVersions,
        setBackgroundResearchVersions,
        setNotes,
        setBackgroundResearch
      })}
    </>
  );
}
