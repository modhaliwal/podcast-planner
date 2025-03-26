
import React from 'react';
import { ContentVersion } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
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
  
  // Find current active version
  const activeVersion = sortedVersions.find(v => v.id === activeVersionId) || sortedVersions[0];
  
  // Count for each source type
  const sourceCount = sortedVersions.reduce((acc, v) => {
    acc[v.source] = (acc[v.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <HistoryIcon className="h-4 w-4 mr-1" />
          Versions ({versions.length})
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel>
          <div className="flex justify-between items-center">
            <span>Version History</span>
            <span className="text-xs text-muted-foreground">
              {Object.entries(sourceCount).map(([source, count]) => (
                <span key={source} className="ml-2">
                  {getSourceLabel(source)}: {count}
                </span>
              ))}
            </span>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <div className="max-h-[250px] overflow-y-auto">
          {sortedVersions.map(version => (
            <DropdownMenuItem key={version.id} className="py-2 px-4 cursor-pointer">
              <div 
                className="w-full"
                onClick={() => onSelectVersion(version)}
              >
                <div className="flex justify-between items-center">
                  <span 
                    className={`font-medium ${version.id === activeVersionId ? 'text-primary' : ''}`}
                  >
                    {version.id === activeVersionId && (
                      <CheckIcon className="inline h-4 w-4 mr-1 text-primary" />
                    )}
                    {getSourceLabel(version.source)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(version.timestamp)}
                  </span>
                </div>
                
                <div className="text-xs mt-1 text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {version.content.substring(0, 100)}
                  {version.content.length > 100 ? '...' : ''}
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
