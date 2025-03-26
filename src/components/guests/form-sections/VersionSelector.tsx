
import { ContentVersion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Clock, Check } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface VersionSelectorProps {
  versions: ContentVersion[];
  onSelectVersion: (version: ContentVersion) => void;
  activeVersionId?: string;
}

export function VersionSelector({ 
  versions, 
  onSelectVersion, 
  activeVersionId 
}: VersionSelectorProps) {
  if (!versions || versions.length === 0) {
    return null;
  }

  // Sort versions by timestamp, newest first
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Versions ({versions.length})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {sortedVersions.map((version) => (
          <DropdownMenuItem
            key={version.id}
            onClick={() => onSelectVersion(version)}
            className="flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-sm">
                {format(new Date(version.timestamp), "MMM d, yyyy h:mm a")}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {version.source}
              </span>
            </div>
            {activeVersionId === version.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
