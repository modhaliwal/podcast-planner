
import { useState } from "react";
import { useAIPrompts, AIPrompt } from "@/hooks/useAIPrompts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { toast } from "@/hooks/use-toast";
import { PromptsList } from "./ai-prompts/PromptsList";
import { PromptEditor } from "./ai-prompts/PromptEditor";

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
      description: editedPrompt.description,
      example_output: editedPrompt.example_output,
      context_instructions: editedPrompt.context_instructions,
      system_prompt: editedPrompt.system_prompt
    });
    
    setIsSaving(false);
    if (success) {
      toast({
        title: "Success",
        description: "AI prompt updated successfully"
      });
    }
  };

  const handleReset = () => {
    if (!activePromptId) return;
    
    const originalPrompt = prompts.find(p => p.id === activePromptId);
    if (originalPrompt) {
      setEditedPrompt(originalPrompt);
      toast({
        title: "Info",
        description: "Changes discarded"
      });
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
          <PromptsList 
            prompts={prompts} 
            activePromptId={activePromptId} 
            onSelectPrompt={handleSelectPrompt} 
          />
          
          <div className="col-span-1 md:col-span-2">
            <PromptEditor 
              editedPrompt={editedPrompt}
              onInputChange={handleInputChange}
              onSave={handleSave}
              onReset={handleReset}
              isSaving={isSaving}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
