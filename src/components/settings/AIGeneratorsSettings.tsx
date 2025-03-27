
import { useState } from "react";
import { useAIPrompts, AIPrompt } from "@/hooks/useAIPrompts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { GeneratorsList } from "./ai-generators/GeneratorsList";
import { GeneratorEditor } from "./ai-generators/GeneratorEditor";
import { GlobalSystemSettings } from "./ai-generators/GlobalSystemSettings";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AIGeneratorsSettings() {
  const { prompts, isLoading, updatePrompt, createPrompt, deletePrompt } = useAIPrompts();
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState<Partial<AIPrompt> | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "system">("list");

  const handleSelectPrompt = (promptId: string) => {
    if (showAddForm) {
      setShowAddForm(false);
    }
    
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

  const handleJsonParametersChange = (jsonString: string) => {
    if (!editedPrompt) return;
    
    try {
      // Validate that it's proper JSON
      JSON.parse(jsonString);
      setEditedPrompt({
        ...editedPrompt,
        parameters: jsonString
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The parameters must be a valid JSON object",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!editedPrompt) {
      return;
    }

    setIsSaving(true);
    
    if (showAddForm) {
      const success = await createPrompt({
        title: editedPrompt.title || "New Generator",
        prompt_text: editedPrompt.prompt_text || "",
        description: editedPrompt.description || "",
        example_output: editedPrompt.example_output || "",
        context_instructions: editedPrompt.context_instructions || "",
        system_prompt: editedPrompt.system_prompt || "",
        ai_model: editedPrompt.ai_model || "openai",
        model_name: editedPrompt.model_name || "",
        parameters: editedPrompt.parameters || "{}"
      });
      
      if (success) {
        setShowAddForm(false);
        toast({
          title: "Success",
          description: "AI generator created successfully"
        });
      }
    } else if (activePromptId) {
      const success = await updatePrompt(activePromptId, {
        title: editedPrompt.title,
        prompt_text: editedPrompt.prompt_text,
        description: editedPrompt.description,
        example_output: editedPrompt.example_output,
        context_instructions: editedPrompt.context_instructions,
        system_prompt: editedPrompt.system_prompt,
        ai_model: editedPrompt.ai_model,
        model_name: editedPrompt.model_name,
        parameters: editedPrompt.parameters
      });
      
      if (success) {
        toast({
          title: "Success",
          description: "AI generator updated successfully"
        });
      }
    }
    
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!activePromptId) return;
    
    if (confirm("Are you sure you want to delete this generator?")) {
      setIsSaving(true);
      const success = await deletePrompt(activePromptId);
      setIsSaving(false);
      
      if (success) {
        setActivePromptId(null);
        setEditedPrompt(null);
        toast({
          title: "Success",
          description: "AI generator deleted successfully"
        });
      }
    }
  };

  const handleReset = () => {
    if (showAddForm) {
      setShowAddForm(false);
      setEditedPrompt(null);
      return;
    }
    
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

  const handleAddNew = () => {
    setActivePromptId(null);
    setEditedPrompt({
      title: "New Generator",
      prompt_text: "",
      description: "",
      example_output: "",
      context_instructions: "",
      system_prompt: "",
      ai_model: "openai",
      model_name: "",
      parameters: "{}"
    });
    setShowAddForm(true);
  };

  if (isLoading) {
    return (
      <LoadingIndicator message="Loading AI generators..." />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Generators</CardTitle>
        <CardDescription>
          Configure the AI generators used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "list" | "system")}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Generators</TabsTrigger>
            <TabsTrigger value="system">Global Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Available Generators</h3>
                  <Button variant="outline" size="sm" onClick={handleAddNew}>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add New
                  </Button>
                </div>
                
                <GeneratorsList 
                  prompts={prompts} 
                  activePromptId={activePromptId} 
                  onSelectPrompt={handleSelectPrompt} 
                  isAdding={showAddForm}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <GeneratorEditor 
                  editedPrompt={editedPrompt}
                  onInputChange={handleInputChange}
                  onJsonParametersChange={handleJsonParametersChange}
                  onSave={handleSave}
                  onReset={handleReset}
                  onDelete={handleDelete}
                  isSaving={isSaving}
                  isNewGenerator={showAddForm}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="system">
            <GlobalSystemSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
