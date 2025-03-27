
import React from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratorsList } from "./GeneratorsList";

interface GeneratorsSidebarProps {
  prompts: AIPrompt[];
  activePromptId: string | null;
  onSelectPrompt: (promptId: string) => void;
  isAdding: boolean;
  onAddNew: () => void;
}

export function GeneratorsSidebar({ 
  prompts, 
  activePromptId, 
  onSelectPrompt, 
  isAdding
}: GeneratorsSidebarProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-3 bg-muted/30 border-b">
        <h3 className="text-sm font-medium">Available Generators</h3>
      </div>
      
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="p-2">
          <GeneratorsList 
            prompts={prompts} 
            activePromptId={activePromptId} 
            onSelectPrompt={onSelectPrompt} 
            isAdding={isAdding}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
