
import React from 'react';
import { ContentVersion } from '@/lib/types';
import { format } from 'date-fns';
import { CheckIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Get summary of version sources
const getVersionSummary = (versions: ContentVersion[]) => {
  if (!versions || versions.length === 0) return '';
  
  const aiCount = versions.filter(v => v.source === 'ai').length;
  const manualCount = versions.filter(v => v.source === 'manual').length;
  const importCount = versions.filter(v => v.source === 'import').length;
  
  const parts = [];
  if (aiCount > 0) parts.push(`AI Generated: ${aiCount}`);
  if (manualCount > 0) parts.push(`Manual Edit: ${manualCount}`);
  if (importCount > 0) parts.push(`Import: ${importCount}`);
  
  return parts.join(' ');
};

interface VersionHistoryProps {
  versions: ContentVersion[];
  onSelectVersion: (version: ContentVersion) => void;
  activeVersionId?: string;
  onClearAllVersions?: () => void;
}

export function VersionHistory({
  versions,
  onSelectVersion,
  activeVersionId,
  onClearAllVersions
}: VersionHistoryProps) {
  // Sort versions by timestamp descending (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  if (!versions || versions.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2 border-b">
        <h3 className="font-medium">Version History</h3>
        <div className="text-sm text-muted-foreground">
          {getVersionSummary(versions)}
        </div>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {sortedVersions.map(version => (
          <div 
            key={version.id}
            className={`p-3 rounded-md ${version.id === activeVersionId ? 'bg-accent/50' : 'hover:bg-accent/20'} transition-colors cursor-pointer`}
            onClick={() => onSelectVersion(version)}
          >
            <div className="flex items-center gap-2">
              {version.id === activeVersionId ? (
                <CheckIcon className="h-4 w-4 flex-shrink-0 text-primary" />
              ) : (
                <div className="h-4 w-4 flex-shrink-0" /> // Empty space for alignment
              )}
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                v{version.versionNumber || '?'}
              </span>
              <span className="text-sm font-medium">{getSourceLabel(version.source)}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {formatTimestamp(version.timestamp)}
              </span>
            </div>
            
            {version.content && (
              <div className="mt-2 text-sm text-muted-foreground line-clamp-2 pl-6">
                {version.content.substring(0, 100)}{version.content.length > 100 ? '...' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {onClearAllVersions && (
        <div className="pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:text-destructive/90 w-full justify-start"
            onClick={onClearAllVersions}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Clear All Versions
          </Button>
        </div>
      )}
    </div>
  );
}
