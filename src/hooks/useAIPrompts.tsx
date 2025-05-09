
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/toast/use-toast';
import { repositories } from '@/repositories';

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
  
  // Fetch all prompts from the database
  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      const fetchedPrompts = await repositories.aiGenerators.getAll();
      setPrompts(fetchedPrompts);
    } catch (error: any) {
      console.error("Error fetching AI prompts:", error);
      toast({
        title: "Error",
        description: `Failed to fetch AI prompts: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load prompts when the hook is initialized
  useEffect(() => {
    fetchPrompts();
  }, []);
  
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
  
  // Get a prompt by its key
  const getPromptByKey = async (key: string) => {
    setIsLoading(true);
    try {
      const prompt = await repositories.aiGenerators.getByKey(key);
      return prompt;
    } catch (error: any) {
      console.error("Error getting prompt by key:", error);
      toast({
        title: "Error",
        description: `Failed to get prompt: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update an existing prompt
  const updatePrompt = async (slug: string, data: Partial<AIPrompt>) => {
    setIsLoading(true);
    try {
      // Find the prompt by slug to get its ID
      const existingPrompt = prompts.find(p => p.slug === slug);
      if (!existingPrompt || !existingPrompt.id) {
        throw new Error(`Prompt with slug ${slug} not found`);
      }
      
      // Update the prompt using the repository
      await repositories.aiGenerators.update(existingPrompt.id, data);
      
      // Refresh prompts list
      await fetchPrompts();
      
      toast({
        title: "Success",
        description: "Generator updated successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating prompt:", error);
      toast({
        title: "Error",
        description: `Failed to update generator: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new prompt
  const createPrompt = async (data: AIPrompt) => {
    setIsLoading(true);
    try {
      // Create the prompt using the repository
      await repositories.aiGenerators.add(data);
      
      // Refresh prompts list
      await fetchPrompts();
      
      toast({
        title: "Success",
        description: "Generator created successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error creating prompt:", error);
      toast({
        title: "Error",
        description: `Failed to create generator: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a prompt
  const deletePrompt = async (slug: string) => {
    setIsLoading(true);
    try {
      // Find the prompt by slug to get its ID
      const existingPrompt = prompts.find(p => p.slug === slug);
      if (!existingPrompt || !existingPrompt.id) {
        throw new Error(`Prompt with slug ${slug} not found`);
      }
      
      // Delete the prompt using the repository
      await repositories.aiGenerators.delete(existingPrompt.id);
      
      // Refresh prompts list
      await fetchPrompts();
      
      toast({
        title: "Success",
        description: "Generator deleted successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting prompt:", error);
      toast({
        title: "Error",
        description: `Failed to delete generator: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };
  
  return {
    isLoading,
    prompts,
    fetchPrompts,
    generatePrompt,
    updatePrompt,
    createPrompt,
    deletePrompt,
    generateSlug,
    getPromptByKey
  };
}
