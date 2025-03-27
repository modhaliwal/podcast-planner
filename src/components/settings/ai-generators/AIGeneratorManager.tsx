
import React, { useState } from "react";
import { PenLine, PlusCircle, SearchIcon } from "lucide-react";
import { GeneratorsSidebar } from "./GeneratorsSidebar";
import { GeneratorForm } from "./GeneratorForm";
import { useGeneratorForm } from "./hooks/useGeneratorForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function AIGeneratorManager() {
  const {
    prompts,
    activePromptSlug,
    editedPrompt,
    showAddForm,
    isSaving,
    handleSelectPrompt,
    handleInputChange,
    handleSlugChange,
    handleJsonParametersChange,
    handleSave,
    handleDelete,
    handleReset,
    handleAddNew
  } = useGeneratorForm();

  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter prompts based on search term
  const filteredPrompts = searchTerm 
    ? prompts.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prompt_text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : prompts;

  // Check if we have any prompts to display
  const hasPrompts = prompts.length > 0;
  const hasFilteredPrompts = filteredPrompts.length > 0;
  const showEmpty = !hasPrompts || (searchTerm && !hasFilteredPrompts);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar with search and list */}
      <div className="col-span-1 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search generators..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            size="sm" 
            onClick={handleAddNew}
            disabled={showAddForm}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span>New</span>
          </Button>
        </div>
        
        {showEmpty ? (
          <div className="col-span-1 rounded-md border p-0 h-[calc(100vh-240px)]">
            <EmptyState
              icon={<PenLine className="h-6 w-6" />}
              title="No AI Generators found"
              description={searchTerm ? "Try a different search term" : "Get started by creating your first AI generator"}
              action={{
                label: "Create Generator",
                onClick: handleAddNew
              }}
              className="h-full border-0"
            />
          </div>
        ) : (
          <GeneratorsSidebar
            prompts={filteredPrompts}
            activePromptSlug={activePromptSlug}
            onSelectPrompt={handleSelectPrompt}
            isAdding={showAddForm}
            onAddNew={handleAddNew}
          />
        )}
      </div>
      
      {/* Generator form */}
      <div className="col-span-2">
        <GeneratorForm
          editedPrompt={editedPrompt}
          onInputChange={handleInputChange}
          onSlugChange={handleSlugChange}
          onJsonParametersChange={handleJsonParametersChange}
          onSave={handleSave}
          onReset={handleReset}
          onDelete={handleDelete}
          isSaving={isSaving}
          isNewGenerator={showAddForm}
        />
      </div>
    </div>
  );
}
