
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type AIPrompt = {
  id: string;
  key?: string;
  title: string;
  prompt_text: string;
  created_at: string;
  updated_at: string;
  system_prompt?: string;
  context_instructions?: string;
  example_output?: string;
  ai_model?: string;
  model_name?: string;
  parameters?: string;
};

export function useAIPrompts() {
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setPrompts(data || []);
    } catch (error: any) {
      console.error('Error fetching AI prompts:', error);
      toast({
        title: "Error",
        description: `Failed to load AI prompts: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPrompt = useCallback(async (promptData: Partial<AIPrompt>) => {
    try {
      const { data, error } = await supabase
        .from('ai_prompts')
        .insert({
          title: promptData.title || "",
          prompt_text: promptData.prompt_text || "",
          system_prompt: promptData.system_prompt,
          context_instructions: promptData.context_instructions,
          example_output: promptData.example_output,
          ai_model: promptData.ai_model,
          model_name: promptData.model_name,
          parameters: promptData.parameters,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      await fetchPrompts(); // Refresh the prompts
      return true;
    } catch (error: any) {
      console.error('Error creating AI prompt:', error);
      toast({
        title: "Error",
        description: `Failed to create prompt: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  }, [fetchPrompts]);

  const updatePrompt = useCallback(async (id: string, updates: Partial<AIPrompt>) => {
    try {
      const { error } = await supabase
        .from('ai_prompts')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchPrompts(); // Refresh the prompts
      return true;
    } catch (error: any) {
      console.error('Error updating AI prompt:', error);
      toast({
        title: "Error",
        description: `Failed to update prompt: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  }, [fetchPrompts]);

  const deletePrompt = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_prompts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchPrompts(); // Refresh the prompts
      return true;
    } catch (error: any) {
      console.error('Error deleting AI prompt:', error);
      toast({
        title: "Error",
        description: `Failed to delete prompt: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  }, [fetchPrompts]);

  const getPromptByKey = useCallback((key: string) => {
    return prompts.find(prompt => prompt.key === key);
  }, [prompts]);

  const getPromptById = useCallback((id: string) => {
    return prompts.find(prompt => prompt.id === id);
  }, [prompts]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  return {
    prompts,
    isLoading,
    fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
    getPromptByKey,
    getPromptById
  };
}
