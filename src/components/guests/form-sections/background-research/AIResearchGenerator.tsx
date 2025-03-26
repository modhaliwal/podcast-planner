
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Guest } from "@/lib/types";
import { generateBackgroundResearch } from "./BackgroundResearchGenerator";
import { useAIPrompts } from "@/hooks/useAIPrompts";

interface AIResearchGeneratorProps {
  guest?: Guest;
  onGenerationComplete: (content: string) => void;
}

export function AIResearchGenerator({ 
  guest, 
  onGenerationComplete 
}: AIResearchGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { getPromptByKey } = useAIPrompts();

  const handleGenerateResearch = async () => {
    if (guest) {
      setIsLoading(true);
      try {
        await generateBackgroundResearch(
          guest, 
          setIsLoading, 
          (markdown) => {
            if (markdown) {
              onGenerationComplete(markdown);
            }
          },
          getPromptByKey
        );
      } catch (error) {
        console.error("Error generating research:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerateResearch}
      disabled={isLoading}
      className="h-8 gap-1"
    >
      <Sparkles className="h-3.5 w-3.5" />
      {isLoading ? "Generating..." : "Generate"}
    </Button>
  );
}
