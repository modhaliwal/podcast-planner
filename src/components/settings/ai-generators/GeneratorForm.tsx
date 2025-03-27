
import React from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratorEditor } from "./GeneratorEditor";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card>
        <CardContent className="flex items-center justify-center h-[500px] p-6">
          <p className="text-muted-foreground">
            Select a generator to edit or create a new one
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 pt-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
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
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">System Prompt</label>
                  <textarea
                    name="system_prompt"
                    value={editedPrompt.system_prompt || ""}
                    onChange={onInputChange}
                    rows={6}
                    className="w-full rounded-md border p-2 text-sm font-mono"
                    placeholder="Enter system instructions for this generator..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Parameters (JSON)</label>
                  <textarea
                    name="parameters"
                    value={editedPrompt.parameters || "{}"}
                    onChange={(e) => onJsonParametersChange(e.target.value)}
                    rows={6}
                    className="w-full rounded-md border p-2 text-sm font-mono"
                    placeholder="{}"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
