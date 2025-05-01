import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/toast/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type AIPrompt = {
  id: string;
  slug: string;
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
        .from('ai_generators')
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
      // Generate slug from title if not provided
      const slug = promptData.slug || generateSlug(promptData.title || "");

      const { data, error } = await supabase
        .from('ai_generators')
        .insert({
          title: promptData.title || "",
          prompt_text: promptData.prompt_text || "",
          slug: slug,
          key: promptData.key || undefined,
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

  const updatePrompt = useCallback(async (slug: string, updates: Partial<AIPrompt>) => {
    try {
      // Remove slug from updates since it shouldn't be editable after creation
      const { slug: _, ...updatesWithoutSlug } = updates;

      const { error } = await supabase
        .from('ai_generators')
        .update({ 
          ...updatesWithoutSlug,
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug);

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

  const deletePrompt = useCallback(async (slug: string) => {
    try {
      const { error } = await supabase
        .from('ai_generators')
        .delete()
        .eq('slug', slug);

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

  const getPromptBySlug = useCallback((slug: string) => {
    return prompts.find(prompt => prompt.slug === slug);
  }, [prompts]);

  // Helper function to generate a slug from a title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

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
    getPromptById,
    getPromptBySlug,
    generateSlug
  };
}