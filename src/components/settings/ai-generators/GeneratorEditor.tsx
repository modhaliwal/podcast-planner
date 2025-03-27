
import React from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorActions } from "./editor/EditorActions";

interface GeneratorEditorProps {
  editedPrompt: Partial<AIPrompt> | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onSlugChange,
  onJsonParametersChange,
  onSave, 
  onReset, 
  onDelete,
  isSaving,
  isNewGenerator 
}: GeneratorEditorProps) {
  if (!editedPrompt) return null;

  const modelOptions = [
    { value: "openai", label: "OpenAI" },
    { value: "perplexity", label: "Perplexity AI" },
    { value: "claude", label: "Anthropic" },
    { value: "gemini", label: "Google Gemini" }
  ];
  
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onInputChange({
      target: { name: 'ai_model', value: e.target.value }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="relative h-[500px] flex flex-col">
      <ScrollArea className="flex-1 pr-4 pb-16">
        <div className="space-y-6">
          {/* Title and basic info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Generator Name</Label>
              <Input
                id="title"
                name="title"
                value={editedPrompt.title || ''}
                onChange={onInputChange}
                placeholder="Enter generator name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="slug">
                Slug
                {!isNewGenerator && <span className="text-xs text-muted-foreground ml-2">(read-only after creation)</span>}
              </Label>
              <Input
                id="slug"
                name="slug"
                value={editedPrompt.slug || ''}
                onChange={onSlugChange}
                placeholder="generator-slug"
                className="mt-1"
                readOnly={!isNewGenerator}
                disabled={!isNewGenerator}
              />
              <p className="text-xs text-muted-foreground mt-1">
                The slug is used in URLs and as a unique identifier
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ai_model">AI Provider</Label>
                <select
                  id="ai_model"
                  name="ai_model"
                  value={editedPrompt.ai_model || 'openai'}
                  onChange={handleModelChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                >
                  {modelOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="model_name">Model Name</Label>
                <Input
                  id="model_name"
                  name="model_name"
                  value={editedPrompt.model_name || ''}
                  onChange={onInputChange}
                  placeholder={editedPrompt.ai_model === 'openai' ? 'gpt-4o' : 
                    editedPrompt.ai_model === 'perplexity' ? 'llama-3.1-sonar-small-128k' : 
                    editedPrompt.ai_model === 'claude' ? 'claude-3-opus' :
                    'gemini-pro'}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The specific model from the selected provider
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Context and prompt */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="context_instructions">Context Instructions</Label>
              <textarea
                id="context_instructions"
                name="context_instructions"
                value={editedPrompt.context_instructions || ''}
                onChange={onInputChange}
                rows={3}
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                placeholder="Instructions to provide context for the AI..."
              />
            </div>
            
            <div>
              <Label htmlFor="prompt_text">Prompt Template</Label>
              <textarea
                id="prompt_text"
                name="prompt_text"
                value={editedPrompt.prompt_text || ''}
                onChange={onInputChange}
                rows={6}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 font-mono"
                placeholder="Enter the prompt template with {variables}..."
              />
            </div>
            
            <div>
              <Label htmlFor="example_output">Example Output</Label>
              <textarea
                id="example_output"
                name="example_output"
                value={editedPrompt.example_output || ''}
                onChange={onInputChange}
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                placeholder="Example of what the output should look like..."
              />
            </div>
          </div>
          
          <div className="h-16"></div> {/* Add space at the bottom to ensure content doesn't get hidden behind the sticky footer */}
        </div>
      </ScrollArea>
      
      {/* Sticky action buttons */}
      <EditorActions
        onSave={onSave}
        onReset={onReset}
        onDelete={onDelete}
        isSaving={isSaving}
        isNewGenerator={isNewGenerator}
      />
    </div>
  );
}
