
import React from 'react';
import { ContentVersion } from '@/lib/types';
import { CheckIcon } from 'lucide-react';
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
    <div className="w-full space-y-2">
      <div className="text-sm font-medium">Version History</div>
      <div className="border rounded-md overflow-hidden">
        {sortedVersions.map(version => (
          <div
            key={version.id}
            className={`flex items-center gap-2 p-3 border-b last:border-b-0 cursor-pointer ${
              version.id === activeVersionId ? 'bg-muted/50' : 'hover:bg-muted/20'
            }`}
            onClick={() => onSelectVersion(version)}
          >
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
        ))}
      </div>
      
      {onClearAllVersions && versions.length > 1 && (
        <button 
          onClick={onClearAllVersions}
          className="text-xs text-destructive hover:underline mt-1"
        >
          Clear all versions
        </button>
      )}
    </div>
  );
}
