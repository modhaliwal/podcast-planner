
import { useState, useEffect } from "react";
import { Guest, ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { ensureVersionNumbers } from "@/hooks/versions";

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
