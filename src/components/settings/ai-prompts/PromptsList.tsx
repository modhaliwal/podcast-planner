
import { useState } from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PromptsListProps {
  prompts: AIPrompt[];
  activePromptId: string | null;
  onSelectPrompt: (promptId: string) => void;
}

export function PromptsList({ prompts, activePromptId, onSelectPrompt }: PromptsListProps) {
  return (
    <div className="col-span-1">
      <h3 className="text-sm font-medium mb-3">Available Prompts</h3>
      <ScrollArea className="h-[500px]">
        <div className="space-y-2">
          {prompts.map((prompt) => (
            <Button
              key={prompt.id}
              variant={activePromptId === prompt.id ? "default" : "outline"}
              className="w-full justify-start text-left"
              onClick={() => onSelectPrompt(prompt.id)}
            >
              <div className="truncate">
                {prompt.title}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
