
import React from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratorHeader } from "./editor/GeneratorHeader";
import { ParametersSection } from "./editor/ParametersSection";
import { PromptSections } from "./editor/PromptSections";
import { EditorActions } from "./editor/EditorActions";

interface GeneratorEditorProps {
  editedPrompt: Partial<AIPrompt> | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onJsonParametersChange: (json: string) => void;
  onSave: () => void;
  onReset: () => void;
  onDelete: () => void;
  isSaving: boolean;
  isNewGenerator: boolean;
}

export function GeneratorEditor({ 
  editedPrompt, 
  onInputChange, 
  onJsonParametersChange,
  onSave, 
  onReset, 
  onDelete,
  isSaving,
  isNewGenerator 
}: GeneratorEditorProps) {
  if (!editedPrompt) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Select a generator to edit or create a new one
        </p>
      </div>
    );
  }

  const handleModelChange = (value: string) => {
    onInputChange({
      target: { name: 'ai_model', value }
    } as React.ChangeEvent<HTMLInputElement>);
  };
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        <GeneratorHeader
          title={editedPrompt.title || ''}
          aiModel={editedPrompt.ai_model || 'openai'}
          modelName={editedPrompt.model_name || ''}
          id={editedPrompt.id}
          isNewGenerator={isNewGenerator}
          onInputChange={onInputChange}
          onModelChange={handleModelChange}
        />
        
        <Separator />
        
        <ParametersSection 
          parameters={editedPrompt.parameters || '{}'}
          onParametersChange={onJsonParametersChange}
        />
        
        <PromptSections
          contextInstructions={editedPrompt.context_instructions || ''}
          promptText={editedPrompt.prompt_text || ''}
          exampleOutput={editedPrompt.example_output || ''}
          onInputChange={onInputChange}
        />
        
        <EditorActions
          onSave={onSave}
          onReset={onReset}
          onDelete={onDelete}
          isSaving={isSaving}
          isNewGenerator={isNewGenerator}
        />
      </div>
    </ScrollArea>
  );
}
