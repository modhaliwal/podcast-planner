
import React from 'react';
import { ContentVersion } from '@/lib/types';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
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
  // Sort versions by timestamp descending (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Get the active version for display
  const activeVersion = activeVersionId 
    ? versions.find(v => v.id === activeVersionId) 
    : sortedVersions[0];
  
  return (
    <div className="flex justify-end mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <span>Version: {activeVersion?.versionNumber || '1'}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Version History</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {sortedVersions.map(version => (
              <DropdownMenuItem
                key={version.id}
                className={`${version.id === activeVersionId ? 'bg-muted/50' : ''} cursor-pointer`}
                onClick={() => onSelectVersion(version)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="w-4">
                    {version.id === activeVersionId && (
                      <CheckIcon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                    v{version.versionNumber || '?'}
                  </span>
                  <span className="text-sm">{getSourceLabel(version.source)}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
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
                onClick={onClearAllVersions}
                className="text-xs text-destructive"
              >
                Clear all versions
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
