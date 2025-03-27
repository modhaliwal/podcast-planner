
import React from "react";
import { AIPrompt } from "@/hooks/useAIPrompts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratorEditor } from "./GeneratorEditor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Save } from "lucide-react";

interface GeneratorFormProps {
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

export function GeneratorForm({ 
  editedPrompt, 
  onInputChange,
  onSlugChange,
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
              onSlugChange={onSlugChange}
              onJsonParametersChange={onJsonParametersChange}
              onSave={onSave}
              onReset={onReset}
              onDelete={onDelete}
              isSaving={isSaving}
              isNewGenerator={isNewGenerator}
            />
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="relative h-[500px] flex flex-col">
              <div className="space-y-4 overflow-y-auto pr-4 pb-16">
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
                    <p className="text-xs text-muted-foreground mt-1">
                      System instructions that guide the AI's behavior and capabilities
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Parameters (JSON Schema)</label>
                    <textarea
                      name="parameters"
                      value={editedPrompt.parameters || "{}"}
                      onChange={(e) => onJsonParametersChange(e.target.value)}
                      rows={6}
                      className="w-full rounded-md border p-2 text-sm font-mono"
                      placeholder="{}"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Define the expected parameters schema for this generator
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Use the same sticky actions component for both tabs */}
              <div className="sticky bottom-0 z-10 bg-background py-3 px-4 border-t">
                <div className="flex justify-between space-x-2">
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
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
