import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Trash } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Guest, ContentVersion } from "@/lib/types";
import { generateBackgroundResearch } from "./BackgroundResearchGenerator";
import { useAIPrompts } from "@/hooks/useAIPrompts";
import { VersionSelector } from "../../form-sections/VersionSelector";

interface BackgroundResearchControlsProps {
  guest: Guest;
  onNewVersionCreated?: (newVersion: ContentVersion) => void;
  onClearAllVersions?: () => void;
  setMarkdownToConvert: (markdown: string | undefined) => void;
  versions?: ContentVersion[];
  onSelectVersion?: (version: ContentVersion) => void;
  activeVersionId?: string;
  onGenerateResearch?: () => Promise<void>;
  isGenerating?: boolean;
}

export function BackgroundResearchControls({
  guest,
  onNewVersionCreated,
  onClearAllVersions,
  setMarkdownToConvert,
  versions = [],
  onSelectVersion,
  activeVersionId,
  onGenerateResearch,
  isGenerating = false
}: BackgroundResearchControlsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { getPromptByKey } = useAIPrompts();

  const handleGenerateResearch = async () => {
    if (onGenerateResearch) {
      return onGenerateResearch();
    }
    
    setIsLoading(true);
    await generateBackgroundResearch(
      guest, 
      setIsLoading, 
      setMarkdownToConvert,
      getPromptByKey
    );
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {versions && versions.length > 0 && onSelectVersion && (
        <VersionSelector 
          versions={versions}
          onSelectVersion={onSelectVersion}
          activeVersionId={activeVersionId}
        />
      )}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGenerateResearch}
        disabled={isLoading || isGenerating}
        className="flex items-center gap-1"
      >
        <Sparkles className="h-4 w-4" />
        {isLoading || isGenerating ? "Generating..." : "Generate Research"}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          if (onNewVersionCreated) {
            const newVersion: ContentVersion = {
              id: 'manual-refresh',
              content: 'Refreshed content',
              timestamp: new Date().toISOString(),
              source: 'manual'
            };
            onNewVersionCreated(newVersion);
          }
          toast.info("Content refreshed");
        }}
        className="flex items-center gap-1"
      >
        <RotateCcw className="h-4 w-4" />
        Refresh
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="flex items-center gap-1">
            <Trash className="h-4 w-4" />
            Clear All
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all saved versions of
              this content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onClearAllVersions) {
                  onClearAllVersions();
                  toast.success("All versions cleared");
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
