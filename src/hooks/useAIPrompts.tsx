
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type AIPrompt = {
  id: string;
  key: string;
  title: string;
  prompt_text: string;
  description?: string;
  created_at: string;
  updated_at: string;
  system_prompt?: string;
  context_instructions?: string;
  example_output?: string;
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
      toast.error(`Failed to load AI prompts: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      
      toast.success('Prompt updated successfully');
      await fetchPrompts(); // Refresh the prompts
      return true;
    } catch (error: any) {
      console.error('Error updating AI prompt:', error);
      toast.error(`Failed to update prompt: ${error.message}`);
      return false;
    }
  }, [fetchPrompts]);

  const getPromptByKey = useCallback((key: string) => {
    return prompts.find(prompt => prompt.key === key);
  }, [prompts]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  return {
    prompts,
    isLoading,
    fetchPrompts,
    updatePrompt,
    getPromptByKey
  };
}
