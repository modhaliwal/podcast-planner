
import React from 'react';
import { ContentVersion } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HistoryIcon, CheckIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';

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
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <HistoryIcon className="h-4 w-4 mr-1" />
          Versions ({versions.length})
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[250px]">
        <div className="max-h-[250px] overflow-y-auto">
          {sortedVersions.map(version => (
            <DropdownMenuItem key={version.id} className="py-2 px-4 cursor-pointer">
              <div 
                className="w-full"
                onClick={() => onSelectVersion(version)}
              >
                <div className="flex items-center gap-2">
                  {version.id === activeVersionId && (
                    <CheckIcon className="h-4 w-4 flex-shrink-0 text-primary" />
                  )}
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                    v{version.versionNumber || '?'}
                  </span>
                  <span className="text-sm">{getSourceLabel(version.source)}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatTimestamp(version.timestamp)}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        
        {onClearAllVersions && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive cursor-pointer"
              onClick={onClearAllVersions}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Clear All Versions
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
