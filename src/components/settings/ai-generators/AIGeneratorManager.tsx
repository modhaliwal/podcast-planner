
import React from "react";
import { GeneratorsSidebar } from "./GeneratorsSidebar";
import { GeneratorForm } from "./GeneratorForm";
import { useGeneratorForm } from "./hooks/useGeneratorForm";

export function AIGeneratorManager() {
  const {
    prompts,
    activePromptId,
    editedPrompt,
    showAddForm,
    isSaving,
    handleSelectPrompt,
    handleInputChange,
    handleJsonParametersChange,
    handleSave,
    handleDelete,
    handleReset,
    handleAddNew
  } = useGeneratorForm();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GeneratorsSidebar
        prompts={prompts}
        activePromptId={activePromptId}
        onSelectPrompt={handleSelectPrompt}
        isAdding={showAddForm}
        onAddNew={handleAddNew}
      />
      
      <GeneratorForm
        editedPrompt={editedPrompt}
        onInputChange={handleInputChange}
        onJsonParametersChange={handleJsonParametersChange}
        onSave={handleSave}
        onReset={handleReset}
        onDelete={handleDelete}
        isSaving={isSaving}
        isNewGenerator={showAddForm}
      />
    </div>
  );
}
