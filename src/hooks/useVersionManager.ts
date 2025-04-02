
import { useState, useCallback } from 'react';
import { ContentVersion } from '@/lib/types';
import { addVersion, setActiveVersion, getActiveVersion } from '@/lib/versionUtils';
import { UseFormReturn } from 'react-hook-form';

interface UseVersionManagerProps {
  form?: UseFormReturn<any>;
  contentField: string;
  versionsField: string;
  onChange?: (content: string) => void;
}

/**
 * Hook for managing content versions with form integration
 */
export const useVersionManager = ({
  form,
  contentField,
  versionsField,
  onChange
}: UseVersionManagerProps) => {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  
  // Initialize versions from form if available
  const initializeVersions = useCallback(() => {
    if (!form) return;
    const formVersions = form.getValues(versionsField);
    if (formVersions && Array.isArray(formVersions)) {
      setVersions(formVersions);
    }
  }, [form, versionsField]);
  
  // Add a new version
  const addNewVersion = useCallback((content: string, source: string = 'manual') => {
    if (!form) return;
    
    const currentVersions = form.getValues(versionsField) || [];
    const updatedVersions = addVersion(currentVersions, content, source);
    
    form.setValue(versionsField, updatedVersions, { shouldDirty: true });
    form.setValue(contentField, content, { shouldDirty: true });
    setVersions(updatedVersions);
    
    if (onChange) {
      onChange(content);
    }
  }, [form, versionsField, contentField, onChange]);
  
  // Set a specific version as active
  const activateVersion = useCallback((versionId: string) => {
    if (!form) return;
    
    const currentVersions = form.getValues(versionsField) || [];
    const updatedVersions = setActiveVersion(currentVersions, versionId);
    
    const activeVersion = getActiveVersion(updatedVersions);
    if (activeVersion) {
      form.setValue(contentField, activeVersion.content, { shouldDirty: true });
      form.setValue(versionsField, updatedVersions, { shouldDirty: true });
      setVersions(updatedVersions);
      
      if (onChange) {
        onChange(activeVersion.content);
      }
    }
  }, [form, versionsField, contentField, onChange]);
  
  // Get the currently active version
  const getActiveContent = useCallback(() => {
    if (!form) return "";
    
    const currentVersions = form.getValues(versionsField) || [];
    const activeVersion = getActiveVersion(currentVersions);
    
    return activeVersion?.content || "";
  }, [form, versionsField]);
  
  return {
    versions,
    initializeVersions,
    addNewVersion,
    activateVersion,
    getActiveContent
  };
};
