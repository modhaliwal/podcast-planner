
import React, { createContext, useContext, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ContentVersion } from '@/lib/types';
import { useContentVersions } from '@/hooks/versions';

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

interface NotesVersionsProviderProps {
  form: UseFormReturn<any>;
  fieldName: string;
  versionsFieldName: string;
  children: ReactNode;
}

export function NotesVersionsProvider({
  form,
  fieldName,
  versionsFieldName,
  children,
}: NotesVersionsProviderProps) {
  const {
    activeVersionId,
    versions,
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion,
    versionSelectorProps
  } = useContentVersions({
    form,
    fieldName,
    versionsFieldName,
  });

  return (
    <NotesVersionsContext.Provider
      value={{
        activeVersionId,
        versions,
        handleContentChange,
        selectVersion,
        clearAllVersions,
        addNewVersion,
        versionSelectorProps,
      }}
    >
      {children}
    </NotesVersionsContext.Provider>
  );
}

export function useNotesVersions() {
  const context = useContext(NotesVersionsContext);
  if (!context) {
    throw new Error("useNotesVersions must be used within a NotesVersionsProvider");
  }
  return context;
}
