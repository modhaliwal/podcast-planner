
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneratorHeaderProps {
  title: string;
  aiModel: string;
  modelName: string;
  id?: string;
  isNewGenerator: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onModelChange: (value: string) => void;
}

export function GeneratorHeader({ 
  title, 
  aiModel, 
  modelName, 
  id, 
  isNewGenerator,
  onInputChange,
  onModelChange
}: GeneratorHeaderProps) {
  const handleCopyId = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      toast({
        title: "Copied",
        description: "Generator ID copied to clipboard"
      });
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Label htmlFor="title">Generator Name</Label>
          <Input
            id="title"
            name="title"
            value={title || ''}
            onChange={onInputChange}
            className="mt-1"
          />
        </div>
        
        <div className="ml-4 w-1/3">
          <Label htmlFor="ai_model">AI Provider</Label>
          <Select
            value={aiModel || 'openai'}
            onValueChange={onModelChange}
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
          value={modelName || ''}
          onChange={onInputChange}
          className="mt-1"
          placeholder={aiModel === 'openai' ? 'gpt-4o' : 
            aiModel === 'perplexity' ? 'llama-3.1-sonar-small-128k-online' : 
            'claude-3-opus-20240229'}
        />
        <p className="text-muted-foreground text-xs mt-1">
          Specific model to use with the selected AI provider
        </p>
      </div>
      
      {!isNewGenerator && id && (
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">Generator ID: {id}</div>
          <Button variant="ghost" size="sm" onClick={handleCopyId} title="Copy ID">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
