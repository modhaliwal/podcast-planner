
import React from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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
  isAdding,
  onAddNew
}: GeneratorsSidebarProps) {
  return (
    <div className="col-span-1">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Available Generators</h3>
        <Button variant="outline" size="sm" onClick={onAddNew}>
          <PlusCircle className="h-4 w-4 mr-1" />
          Add New
        </Button>
      </div>
      
      <GeneratorsList 
        prompts={prompts} 
        activePromptId={activePromptId} 
        onSelectPrompt={onSelectPrompt} 
        isAdding={isAdding}
      />
    </div>
  );
}
