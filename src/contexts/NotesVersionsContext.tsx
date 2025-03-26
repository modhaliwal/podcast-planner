
import { createContext, useContext, ReactNode } from "react";
import { ContentVersion } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import { useContentVersions } from "@/hooks/versions";

interface NotesVersionsContextType {
  activeVersionId: string | null;
  versions: ContentVersion[];
  handleContentChange: () => void;
  selectVersion: (version: ContentVersion) => void;
  clearAllVersions: () => void;
  addNewVersion: (content: string, source?: "manual" | "ai" | "import") => ContentVersion;
  versionSelectorProps: {
    versions: ContentVersion[];
    onSelectVersion: (version: ContentVersion) => void;
    activeVersionId?: string;
    onClearAllVersions?: () => void;
  };
}

const NotesVersionsContext = createContext<NotesVersionsContextType | undefined>(undefined);

export function NotesVersionsProvider<T extends Record<string, any>>({
  children,
  form,
  fieldName,
  versionsFieldName
}: {
  children: ReactNode;
  form: UseFormReturn<T>;
  fieldName: keyof T;
  versionsFieldName: keyof T;
}) {
  // Use our consolidated version management hook
  const versionManager = useContentVersions({
    form,
    fieldName,
    versionsFieldName
  });

  return (
    <NotesVersionsContext.Provider value={versionManager}>
      {children}
    </NotesVersionsContext.Provider>
  );
}

export function useNotesVersions() {
  const context = useContext(NotesVersionsContext);
  if (context === undefined) {
    throw new Error("useNotesVersions must be used within a NotesVersionsProvider");
  }
  return context;
}
