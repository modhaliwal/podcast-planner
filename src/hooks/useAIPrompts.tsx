
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/toast/use-toast';

// Define the AIPrompt interface that's being imported in other files
export interface AIPrompt {
  id?: string;
  slug: string;
  title: string;
  prompt_text: string;
  example_output?: string;
  context_instructions?: string;
  system_prompt?: string;
  ai_model?: string;
  model_name?: string;
  parameters?: string;
}

export function useAIPrompts() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  
  const generatePrompt = async (
    promptType: string,
    params: Record<string, any>
  ) => {
    setIsLoading(true);
    
    try {
      // Call Supabase edge function
      const { data, error } = await supabase.functions.invoke(
        'generate-prompt',
        {
          body: { type: promptType, ...params }
        }
      );
      
      if (error) throw error;
      
      if (!data || !data.prompt) {
        throw new Error('No prompt was generated');
      }
      
      return data.prompt;
    } catch (error: any) {
      console.error("Error generating prompt:", error);
      toast({
        title: "Error",
        description: `Failed to generate prompt: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add missing methods used by other components
  const getPromptByKey = async (key: string) => {
    // Implementation would go here
    return null;
  };
  
  const updatePrompt = async (slug: string, data: Partial<AIPrompt>) => {
    // Implementation would go here
    return true;
  };
  
  const createPrompt = async (data: AIPrompt) => {
    // Implementation would go here
    return true;
  };
  
  const deletePrompt = async (slug: string) => {
    // Implementation would go here
    return true;
  };
  
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };
  
  return {
    isLoading,
    generatePrompt,
    prompts,
    updatePrompt,
    createPrompt,
    deletePrompt,
    generateSlug,
    getPromptByKey
  };
}
