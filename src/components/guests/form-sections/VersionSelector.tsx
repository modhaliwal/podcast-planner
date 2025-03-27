import React, { useState } from 'react';
import { ContentVersion } from '@/lib/types';
import { CheckIcon, ChevronDownIcon, Trash2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Format a timestamp for display
const formatTimestamp = (timestamp: string) => {
  try {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  } catch (e) {
    return timestamp;
  }
};

// Get a source label for display
const getSourceLabel = (source: string) => {
  switch (source) {
    case 'manual': return 'Manual Edit';
    case 'ai': return 'AI Generated';
    case 'import': return 'Imported';
    default: return source;
  }
};

interface VersionSelectorProps {
  versions: ContentVersion[];
  onSelectVersion: (version: ContentVersion) => void;
  activeVersionId?: string;
  onClearAllVersions?: () => void;
}

export function VersionSelector({
  versions,
  onSelectVersion,
  activeVersionId,
  onClearAllVersions
}: VersionSelectorProps) {
  // Add state for confirmation mode
  const [confirmClear, setConfirmClear] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Sort versions by versionNumber descending (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => b.versionNumber - a.versionNumber
  );
  
  // Get the active version for display
  const activeVersion = activeVersionId 
    ? versions.find(v => v.id === activeVersionId) 
    : sortedVersions[0];
  
  // Handle clear request with confirmation
  const handleClearRequest = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirmClear) {
      setConfirmClear(true);
    } else if (onClearAllVersions) {
      onClearAllVersions();
      setConfirmClear(false);
      setOpen(false);
    }
  };
  
  // Reset confirmation state when dropdown closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setConfirmClear(false);
    }
  };
  
  return (
    <div className="flex justify-end mb-2">
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
            <span>Version: {activeVersion?.versionNumber || '1'}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[300px] w-auto" align="end">
          <DropdownMenuLabel>Version History</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {sortedVersions.map(version => (
              <DropdownMenuItem
                key={version.id}
                className={`${version.id === activeVersionId ? 'bg-muted/50' : ''} cursor-pointer`}
                onClick={() => onSelectVersion(version)}
              >
                <div className="flex items-center gap-2 w-full whitespace-nowrap">
                  <div className="w-4 flex-shrink-0">
                    {version.id === activeVersionId && (
                      <CheckIcon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs flex-shrink-0">
                    v{version.versionNumber || '?'}
                  </span>
                  <span className="text-sm flex-shrink-0">{getSourceLabel(version.source)}</span>
                  <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                    {formatTimestamp(version.timestamp)}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          {onClearAllVersions && versions.length > 1 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleClearRequest}
                className={`text-xs ${confirmClear ? 'text-destructive font-medium' : 'text-destructive'}`}
              >
                <div className="flex items-center gap-2">
                  <Trash2Icon className="h-4 w-4" />
                  {confirmClear ? "Yes, I am sure." : "Clear all versions"}
                </div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
