
import { ContentVersion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Clock, Check, Trash } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState, useRef, useEffect, memo } from "react";

interface VersionSelectorProps {
  versions: ContentVersion[];
  onSelectVersion: (version: ContentVersion) => void;
  activeVersionId?: string;
  onClearAllVersions?: () => void;
}

export const VersionSelector = memo(function VersionSelector({ 
  versions, 
  onSelectVersion, 
  activeVersionId,
  onClearAllVersions
}: VersionSelectorProps) {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset confirmation state when dropdown closes
  useEffect(() => {
    if (!dropdownOpen) {
      setIsConfirmingClear(false);
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsConfirmingClear(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  if (!versions || versions.length === 0) {
    return null;
  }

  // Sort versions by timestamp, newest first
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleClearClick = (event: React.MouseEvent) => {
    // Prevent the dropdown from closing when clicking the clear button the first time
    event.preventDefault();
    event.stopPropagation();
    
    if (isConfirmingClear) {
      // If we're confirming, call the clear function
      onClearAllVersions?.();
      setIsConfirmingClear(false);
      // Close the dropdown after confirmation
      setDropdownOpen(false);
    } else {
      setIsConfirmingClear(true);
    }
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Versions ({versions.length})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[240px] max-h-[300px] overflow-auto"
        ref={dropdownRef}
        // Use forceMount to ensure content is rendered in DOM
        forceMount
      >
        {sortedVersions.map((version, index) => (
          <DropdownMenuItem
            key={version.id}
            onClick={() => onSelectVersion(version)}
            className={`flex items-center justify-between ${(version.active || activeVersionId === version.id) ? 'bg-muted/50' : ''}`}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium px-1.5 py-0.5 bg-muted rounded-sm">
                  v{versions.length - index}
                </span>
                <span className="text-sm">
                  {format(new Date(version.timestamp), "MMM d, yyyy h:mm a")}
                </span>
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {version.source}
              </span>
            </div>
            {(version.active || activeVersionId === version.id) && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        {onClearAllVersions && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleClearClick}
              className="text-destructive focus:text-destructive flex items-center"
              onSelect={(e) => {
                // Only prevent the dropdown from closing on the first click
                if (!isConfirmingClear) {
                  e.preventDefault();
                }
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              {isConfirmingClear ? "Are you sure?" : "Clear All Versions"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
