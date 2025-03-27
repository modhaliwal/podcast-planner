
import { useState } from "react";
import { useAIPrompts, AIPrompt } from "@/hooks/useAIPrompts";

export function useGeneratorForm() {
  const { prompts, updatePrompt, createPrompt, deletePrompt, generateSlug } = useAIPrompts();
  const [activePromptSlug, setActivePromptSlug] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState<Partial<AIPrompt> | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectPrompt = (promptSlug: string) => {
    if (showAddForm) {
      setShowAddForm(false);
    }
    
    const selectedPrompt = prompts.find(p => p.slug === promptSlug);
    if (selectedPrompt) {
      setActivePromptSlug(promptSlug);
      setEditedPrompt(selectedPrompt);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedPrompt) return;
    
    const { name, value } = e.target;
    
    // Update slug when title changes, but only in add mode
    if (name === 'title' && showAddForm) {
      setEditedPrompt({
        ...editedPrompt,
        [name]: value,
        slug: generateSlug(value)
      });
    } else {
      setEditedPrompt({
        ...editedPrompt,
        [name]: value
      });
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedPrompt || !showAddForm) return;
    
    // Only allow slug edits during creation
    setEditedPrompt({
      ...editedPrompt,
      slug: e.target.value
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
      console.error("Invalid JSON format:", error);
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
        slug: editedPrompt.slug || generateSlug(editedPrompt.title || "New Generator"),
        prompt_text: editedPrompt.prompt_text || "",
        example_output: editedPrompt.example_output || "",
        context_instructions: editedPrompt.context_instructions || "",
        system_prompt: editedPrompt.system_prompt || "",
        ai_model: editedPrompt.ai_model || "openai",
        model_name: editedPrompt.model_name || "",
        parameters: editedPrompt.parameters || "{}"
      });
      
      if (success) {
        setShowAddForm(false);
      }
    } else if (activePromptSlug) {
      await updatePrompt(activePromptSlug, {
        title: editedPrompt.title,
        prompt_text: editedPrompt.prompt_text,
        example_output: editedPrompt.example_output,
        context_instructions: editedPrompt.context_instructions,
        system_prompt: editedPrompt.system_prompt,
        ai_model: editedPrompt.ai_model,
        model_name: editedPrompt.model_name,
        parameters: editedPrompt.parameters
      });
    }
    
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!activePromptSlug) return;
    
    if (confirm("Are you sure you want to delete this generator?")) {
      setIsSaving(true);
      const success = await deletePrompt(activePromptSlug);
      setIsSaving(false);
      
      if (success) {
        setActivePromptSlug(null);
        setEditedPrompt(null);
      }
    }
  };

  const handleReset = () => {
    if (showAddForm) {
      setShowAddForm(false);
      setEditedPrompt(null);
      return;
    }
    
    if (!activePromptSlug) return;
    
    const originalPrompt = prompts.find(p => p.slug === activePromptSlug);
    if (originalPrompt) {
      setEditedPrompt(originalPrompt);
    }
  };

  const handleAddNew = () => {
    setActivePromptSlug(null);
    const title = "New Generator";
    setEditedPrompt({
      title,
      slug: generateSlug(title),
      prompt_text: "",
      example_output: "",
      context_instructions: "",
      system_prompt: "",
      ai_model: "openai",
      model_name: "",
      parameters: "{}"
    });
    setShowAddForm(true);
  };

  return {
    prompts,
    activePromptSlug,
    editedPrompt,
    showAddForm,
    isSaving,
    handleSelectPrompt,
    handleInputChange,
    handleSlugChange,
    handleJsonParametersChange,
    handleSave,
    handleDelete,
    handleReset,
    handleAddNew
  };
}
