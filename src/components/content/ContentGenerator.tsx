
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ContentGeneratorProps } from "./types";
import { useContentGeneration } from "./hooks/useContentGeneration";

export function ContentGenerator({ config, form }: ContentGeneratorProps) {
  const {
    buttonLabel = "Generate",
    loadingLabel = "Generating..."
  } = config;
  
  const { isGenerating, shouldDisable, generateContent } = useContentGeneration(config, form);

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={generateContent}
      disabled={shouldDisable()}
      className="flex items-center gap-1"
    >
      <Sparkles className="h-4 w-4" />
      {isGenerating ? loadingLabel : buttonLabel}
    </Button>
  );
}
