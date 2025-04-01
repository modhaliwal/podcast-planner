import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { GeneratorHeader } from "./GeneratorHeader";
import { EditorActions } from "./EditorActions";

interface GeneratorEditorProps {
  generator: {
    id: string;
    name: string;
    slug: string;
    description: string;
    contextInstructions: string;
    promptText: string;
    exampleOutput: string;
    parameters: string;
  };
  onSave: (generator: any) => Promise<void>;
  onCancel: () => void;
}

export function GeneratorEditor({
  generator,
  onSave,
  onCancel
}: GeneratorEditorProps) {
  const [name, setName] = useState(generator?.name || '');
  const [slug, setSlug] = useState(generator?.slug || '');
  const [description, setDescription] = useState(generator?.description || '');
  const [contextInstructions, setContextInstructions] = useState(generator?.contextInstructions || '');
  const [promptText, setPromptText] = useState(generator?.promptText || '');
  const [exampleOutput, setExampleOutput] = useState(generator?.exampleOutput || '');
  const [parameters, setParameters] = useState(generator?.parameters || '');
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    if (generator) {
      setName(generator.name || '');
      setSlug(generator.slug || '');
      setDescription(generator.description || '');
      setContextInstructions(generator.contextInstructions || '');
      setPromptText(generator.promptText || '');
      setExampleOutput(generator.exampleOutput || '');
      setParameters(generator.parameters || '');
    }
  }, [generator]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'slug':
        setSlug(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'context_instructions':
        setContextInstructions(value);
        break;
      case 'prompt_text':
        setPromptText(value);
        break;
      case 'example_output':
        setExampleOutput(value);
        break;
      default:
        break;
    }
  };

  const onParametersChange = (value: string) => {
    setParameters(value);
  };

  const handleSave = async () => {
    const updatedGenerator = {
      id: generator.id,
      name,
      slug,
      description,
      contextInstructions,
      promptText,
      exampleOutput,
      parameters
    };
    await onSave(updatedGenerator);
  };

  // Inlined ParametersSection
  const renderParametersSection = () => {
    return (
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
            value={parameters || '{}'}
            onChange={(e) => onParametersChange(e.target.value)}
            className="mt-1 min-h-[150px] font-mono text-sm"
          />
        )}
        
        <p className="text-muted-foreground text-xs mt-1">
          Define custom parameters that can be used in your prompt with {'{parameter_name}'} syntax
        </p>
      </div>
    );
  };

  // Inlined PromptSections
  const renderPromptSections = () => {
    return (
      <>
        <div>
          <Label htmlFor="context_instructions" className="text-base font-semibold">Context Instructions</Label>
          <Textarea
            id="context_instructions"
            name="context_instructions"
            value={contextInstructions || ''}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            className="mt-1 min-h-[150px] font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs mt-1">
            Example outputs to guide the AI on the expected format and content
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <GeneratorHeader
        title={generator.name || "New Generator"}
      />

      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-base font-semibold">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={handleInputChange}
          />
          <p className="text-muted-foreground text-xs mt-1">
            A descriptive name for this generator
          </p>
        </div>

        <div>
          <Label htmlFor="slug" className="text-base font-semibold">Slug</Label>
          <Input
            id="slug"
            name="slug"
            type="text"
            value={slug}
            onChange={handleInputChange}
          />
          <p className="text-muted-foreground text-xs mt-1">
            A unique identifier for this generator (used in API calls)
          </p>
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-semibold">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={handleInputChange}
            className="mt-1 min-h-[150px] font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs mt-1">
            A brief description of what this generator does
          </p>
        </div>

        {renderParametersSection()}
        
        {renderPromptSections()}
      </div>

      <EditorActions
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
}
