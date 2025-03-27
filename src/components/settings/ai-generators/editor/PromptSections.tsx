
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PromptSectionsProps {
  contextInstructions: string;
  promptText: string;
  exampleOutput: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function PromptSections({ 
  contextInstructions, 
  promptText, 
  exampleOutput, 
  onInputChange 
}: PromptSectionsProps) {
  return (
    <>
      <div>
        <Label htmlFor="context_instructions" className="text-base font-semibold">Context Instructions</Label>
        <Textarea
          id="context_instructions"
          name="context_instructions"
          value={contextInstructions || ''}
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
          value={promptText || ''}
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
          value={exampleOutput || ''}
          onChange={onInputChange}
          className="mt-1 min-h-[150px] font-mono text-sm"
        />
        <p className="text-muted-foreground text-xs mt-1">
          Example outputs to guide the AI on the expected format and content
        </p>
      </div>
    </>
  );
}
