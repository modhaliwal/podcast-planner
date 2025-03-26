
import { useState } from "react";
import { useAIPrompts, AIPrompt } from "@/hooks/useAIPrompts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export function AIPromptsSettings() {
  const { prompts, isLoading, updatePrompt } = useAIPrompts();
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState<Partial<AIPrompt> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectPrompt = (promptId: string) => {
    const selectedPrompt = prompts.find(p => p.id === promptId);
    if (selectedPrompt) {
      setActivePromptId(promptId);
      setEditedPrompt(selectedPrompt);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedPrompt) return;
    
    setEditedPrompt({
      ...editedPrompt,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!editedPrompt || !activePromptId) {
      return;
    }

    setIsSaving(true);
    const success = await updatePrompt(activePromptId, {
      title: editedPrompt.title,
      prompt_text: editedPrompt.prompt_text,
      description: editedPrompt.description
    });
    
    setIsSaving(false);
    if (success) {
      toast.success("AI prompt updated successfully");
    }
  };

  const handleReset = () => {
    if (!activePromptId) return;
    
    const originalPrompt = prompts.find(p => p.id === activePromptId);
    if (originalPrompt) {
      setEditedPrompt(originalPrompt);
      toast.info("Changes discarded");
    }
  };

  if (isLoading) {
    return (
      <LoadingIndicator message="Loading AI prompts..." />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Prompts</CardTitle>
        <CardDescription>
          Customize the AI prompts used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <h3 className="text-sm font-medium mb-3">Available Prompts</h3>
            <Separator className="mb-3" />
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {prompts.map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant={activePromptId === prompt.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => handleSelectPrompt(prompt.id)}
                  >
                    <div className="truncate">
                      {prompt.title}
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            {editedPrompt ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={editedPrompt.title || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={editedPrompt.description || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <p className="text-muted-foreground text-xs mt-1">
                    Brief explanation of where this prompt is used
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="prompt_text">Prompt Text</Label>
                  <Textarea
                    id="prompt_text"
                    name="prompt_text"
                    value={editedPrompt.prompt_text || ''}
                    onChange={handleInputChange}
                    className="mt-1 min-h-[200px] font-mono text-sm"
                  />
                  <p className="text-muted-foreground text-xs mt-1">
                    Use ${'{variable}'} for dynamic values that will be replaced at runtime
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isSaving}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Select a prompt to edit
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
