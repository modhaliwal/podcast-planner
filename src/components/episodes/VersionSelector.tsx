
import { ContentVersion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { History, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VersionSelectorProps {
  versions: ContentVersion[];
  activeVersionId: string | null;
  onVersionSelect: (versionId: string) => void;
}

export function VersionSelector({ versions, activeVersionId, onVersionSelect }: VersionSelectorProps) {
  // Sort versions by version number (descending)
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
  
  // Get the active version
  const activeVersion = versions.find(v => v.id === activeVersionId);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <History className="h-3.5 w-3.5" />
          {activeVersion ? `v${activeVersion.versionNumber}` : "History"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {sortedVersions.map((version) => {
          // Format the source label
          let sourceLabel = version.source === "ai" ? "AI Generated" : "Manual Edit";
          
          return (
            <DropdownMenuItem
              key={version.id}
              className={`flex items-center justify-between ${version.id === activeVersionId ? 'bg-accent' : ''}`}
              onClick={() => onVersionSelect(version.id)}
            >
              <div className="flex flex-col">
                <span className="text-sm">Version {version.versionNumber}</span>
                <span className="text-xs text-muted-foreground">
                  {sourceLabel} • {formatDistanceToNow(new Date(version.timestamp), { addSuffix: true })}
                </span>
              </div>
              {version.id === activeVersionId && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
