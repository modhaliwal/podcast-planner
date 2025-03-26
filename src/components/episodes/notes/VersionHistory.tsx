
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ContentVersion } from "@/lib/types";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

interface VersionHistoryProps {
  versions: ContentVersion[];
  activeVersion: ContentVersion | null;
  onSelectVersion: (version: ContentVersion) => void;
  onRevertVersion: (versionId: string) => ContentVersion[];
}

export function VersionHistory({
  versions,
  activeVersion,
  onSelectVersion,
  onRevertVersion
}: VersionHistoryProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectVersion = async (version: ContentVersion) => {
    try {
      setIsLoading(true);
      onSelectVersion(version);
    } catch (error) {
      console.error("Error selecting version:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = async (versionId: string) => {
    try {
      setIsLoading(true);
      onRevertVersion(versionId);
    } catch (error) {
      console.error("Error reverting version:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <h3 className="font-medium">Version History</h3>
        <p className="text-sm text-muted-foreground">
          View and restore previous versions of your notes.
        </p>
      </div>
      
      <Separator />
      
      <div className="max-h-[400px] overflow-y-auto p-0">
        {versions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No versions saved yet. Save your first version to start tracking changes.
          </div>
        ) : (
          <div className="space-y-0">
            {versions.map((version, index) => (
              <div key={version.id} className={`flex items-start justify-between p-4 ${
                version.active ? 'bg-muted/50' : ''
              } ${index !== versions.length - 1 ? 'border-b' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">
                      Version {version.versionNumber || index + 1}
                      {version.active && (
                        <span className="ml-2 text-xs text-primary">(Current)</span>
                      )}
                    </h4>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(version.timestamp).toLocaleString()}
                  </div>
                  <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {version.content.substring(0, 120)}...
                  </div>
                </div>
                
                <div className="ml-4 flex items-center gap-2">
                  {!version.active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectVersion(version)}
                      disabled={isLoading}
                    >
                      View
                    </Button>
                  )}
                  
                  {!version.active && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleRevert(version.id)}
                      disabled={isLoading}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Revert
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
