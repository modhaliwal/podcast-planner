
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/toast/use-toast';

export function useAIPrompts() {
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  return {
    isLoading,
    generatePrompt
  };
}
