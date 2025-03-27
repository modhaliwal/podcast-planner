
import React from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { GeneratorEditor } from "./GeneratorEditor";

interface GeneratorFormProps {
  editedPrompt: Partial<AIPrompt> | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onJsonParametersChange: (json: string) => void;
  onSave: () => void;
  onReset: () => void;
  onDelete: () => void;
  isSaving: boolean;
  isNewGenerator: boolean;
}

export function GeneratorForm({ 
  editedPrompt, 
  onInputChange, 
  onJsonParametersChange,
  onSave, 
  onReset, 
  onDelete,
  isSaving,
  isNewGenerator 
}: GeneratorFormProps) {
  if (!editedPrompt) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Select a generator to edit or create a new one
        </p>
      </div>
    );
  }

  return (
    <div className="col-span-1 md:col-span-2">
      <GeneratorEditor
        editedPrompt={editedPrompt}
        onInputChange={onInputChange}
        onJsonParametersChange={onJsonParametersChange}
        onSave={onSave}
        onReset={onReset}
        onDelete={onDelete}
        isSaving={isSaving}
        isNewGenerator={isNewGenerator}
      />
    </div>
  );
}
