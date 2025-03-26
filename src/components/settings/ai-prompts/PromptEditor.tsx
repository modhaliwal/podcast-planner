
import React from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PromptEditorProps {
  editedPrompt: Partial<AIPrompt> | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export function PromptEditor({ 
  editedPrompt, 
  onInputChange, 
  onSave, 
  onReset, 
  isSaving 
}: PromptEditorProps) {
  if (!editedPrompt) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Select a prompt to edit
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={editedPrompt.title || ''}
            onChange={onInputChange}
            className="mt-1"
          />
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
            Brief explanation of where this prompt is used
          </p>
        </div>
        
        <Separator />
        
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
            Use ${'{variable}'} for dynamic values that will be replaced at runtime
          </p>
        </div>
        
        <div>
          <Label htmlFor="system_prompt" className="text-base font-semibold">System Instructions</Label>
          <Textarea
            id="system_prompt"
            name="system_prompt"
            value={editedPrompt.system_prompt || ''}
            onChange={onInputChange}
            className="mt-1 min-h-[150px] font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs mt-1">
            Instructions that set the AI's behavior, tone, and constraints
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
            Additional context that helps the AI understand how to process the prompt
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
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={isSaving}
          >
            Reset
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
