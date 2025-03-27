
import React, { useState } from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Editor } from "@/components/editor/Editor";
import { Trash2, Save, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const [showJson, setShowJson] = useState(false);
  
  if (!editedPrompt) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Select a generator to edit or create a new one
        </p>
      </div>
    );
  }

  const handleCopyId = () => {
    if (editedPrompt.id) {
      navigator.clipboard.writeText(editedPrompt.id);
      toast({
        title: "Copied",
        description: "Generator ID copied to clipboard"
      });
    }
  };

  const handleParametersChange = (value: string) => {
    onJsonParametersChange(value);
  };
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <Label htmlFor="title">Generator Name</Label>
            <Input
              id="title"
              name="title"
              value={editedPrompt.title || ''}
              onChange={onInputChange}
              className="mt-1"
            />
          </div>
          
          <div className="ml-4 w-1/3">
            <Label htmlFor="ai_model">AI Provider</Label>
            <Select
              value={editedPrompt.ai_model || 'openai'}
              onValueChange={(value) => {
                onInputChange({
                  target: { name: 'ai_model', value }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              <SelectTrigger id="ai_model">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="perplexity">Perplexity</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="model_name">Model Name</Label>
          <Input
            id="model_name"
            name="model_name"
            value={editedPrompt.model_name || ''}
            onChange={onInputChange}
            className="mt-1"
            placeholder={editedPrompt.ai_model === 'openai' ? 'gpt-4o' : 
              editedPrompt.ai_model === 'perplexity' ? 'llama-3.1-sonar-small-128k-online' : 
              'claude-3-opus-20240229'}
          />
          <p className="text-muted-foreground text-xs mt-1">
            Specific model to use with the selected AI provider
          </p>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={editedPrompt.description || ''}
            onChange={onInputChange}
            className="mt-1"
          />
          <p className="text-muted-foreground text-xs mt-1">
            Brief explanation of where this generator is used
          </p>
        </div>
        
        {!isNewGenerator && editedPrompt.id && (
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">Generator ID: {editedPrompt.id}</div>
            <Button variant="ghost" size="sm" onClick={handleCopyId} title="Copy ID">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <Separator />
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="parameters" className="text-base font-semibold">Parameters</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowJson(!showJson)}
            >
              {showJson ? "Hide JSON" : "Show JSON"}
            </Button>
          </div>
          
          {showJson && (
            <Textarea
              id="parameters"
              name="parameters"
              value={editedPrompt.parameters || '{}'}
              onChange={(e) => handleParametersChange(e.target.value)}
              className="mt-1 min-h-[150px] font-mono text-sm"
            />
          )}
          
          <p className="text-muted-foreground text-xs mt-1">
            Define custom parameters that can be used in your prompt with {'{parameter_name}'} syntax
          </p>
        </div>
        
        <div>
          <Label htmlFor="context_instructions" className="text-base font-semibold">Context Instructions</Label>
          <Textarea
            id="context_instructions"
            name="context_instructions"
            value={editedPrompt.context_instructions || ''}
            onChange={onInputChange}
            className="mt-1 min-h-[150px] font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs mt-1">
            Instructions for preparing and interpreting context. Use {'{parameter_name}'} to insert parameters.
          </p>
        </div>
        
        <div>
          <Label htmlFor="prompt_text" className="text-base font-semibold">Main Prompt Text</Label>
          <Textarea
            id="prompt_text"
            name="prompt_text"
            value={editedPrompt.prompt_text || ''}
            onChange={onInputChange}
            className="mt-1 min-h-[150px] font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs mt-1">
            The primary prompt text. Use {'{parameter_name}'} to insert parameters.
          </p>
        </div>
        
        <div>
          <Label htmlFor="example_output" className="text-base font-semibold">Example Output</Label>
          <Textarea
            id="example_output"
            name="example_output"
            value={editedPrompt.example_output || ''}
            onChange={onInputChange}
            className="mt-1 min-h-[150px] font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs mt-1">
            Example outputs to guide the AI on the expected format and content
          </p>
        </div>
        
        <div className="flex justify-between space-x-2 pt-4">
          <div>
            {!isNewGenerator && (
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={isSaving}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onReset}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
