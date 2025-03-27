
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ContentGeneratorProps } from "./types";
import { toast } from "@/hooks/toast";

export function ContentGenerator({ config }: ContentGeneratorProps) {
  const {
    buttonLabel = "Generate",
    loadingLabel = "Generating..."
  } = config;
  
  const handleClick = () => {
    toast({
      title: "AI Generation Unavailable",
      description: "AI Generators are currently being reworked. This feature will be available soon.",
      variant: "destructive"
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={handleClick}
      disabled={true}
      className="flex items-center gap-1"
    >
      <Sparkles className="h-4 w-4" />
      {buttonLabel}
    </Button>
  );
}
