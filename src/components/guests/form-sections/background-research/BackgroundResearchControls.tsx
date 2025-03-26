
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { VersionSelector } from "../VersionSelector";
import { ContentVersion } from "@/lib/types";

interface BackgroundResearchControlsProps {
  versions: ContentVersion[];
  onSelectVersion: (version: ContentVersion) => void;
  activeVersionId?: string;
  onGenerateResearch: () => void;
  isGenerating: boolean;
}

export function BackgroundResearchControls({ 
  versions, 
  onSelectVersion, 
  activeVersionId,
  onGenerateResearch,
  isGenerating
}: BackgroundResearchControlsProps) {
  return (
    <div className="flex justify-between items-center">
      <FormLabel>Background Research</FormLabel>
      <div className="flex space-x-2">
        <VersionSelector 
          versions={versions} 
          onSelectVersion={onSelectVersion} 
          activeVersionId={activeVersionId}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onGenerateResearch}
          disabled={isGenerating}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {isGenerating ? "Generating with Perplexity..." : "Generate Background Research"}
        </Button>
      </div>
    </div>
  );
}
