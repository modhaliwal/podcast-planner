
import { AIPrompt } from "@/hooks/useAIPrompts";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GeneratorsListProps {
  prompts: AIPrompt[];
  activePromptId: string | null;
  onSelectPrompt: (promptId: string) => void;
  isAdding: boolean;
}

export function GeneratorsList({ prompts, activePromptId, onSelectPrompt, isAdding }: GeneratorsListProps) {
  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-2">
        {prompts.map((prompt) => (
          <Button
            key={prompt.id}
            variant={activePromptId === prompt.id ? "default" : "outline"}
            className="w-full justify-start text-left relative"
            onClick={() => onSelectPrompt(prompt.id)}
          >
            <div className="flex flex-col items-start">
              <div className="truncate">{prompt.title}</div>
              {prompt.ai_model && (
                <Badge variant="outline" className="mt-1">
                  {prompt.ai_model}
                </Badge>
              )}
            </div>
          </Button>
        ))}
        
        {isAdding && (
          <Button
            variant="default"
            className="w-full justify-start text-left"
            disabled
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <div className="truncate">New Generator</div>
          </Button>
        )}
      </div>
    </ScrollArea>
  );
}
