
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { showGenerationToasts } from "../utils/generationUtils";
import { supabase } from "@/integrations/supabase/client";

interface UseGeneratorContentProps {
  generatorSlug: string;
  fieldName: string;
  form: UseFormReturn<any>;
  parameters?: Record<string, any>;
  responseFormat?: 'markdown' | 'html';
  onContentGenerated?: (content: string) => void;
}

export const useGeneratorContent = ({
  generatorSlug,
  fieldName,
  form,
  parameters = {},
  responseFormat = 'markdown',
  onContentGenerated
}: UseGeneratorContentProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [usedPrompt, setUsedPrompt] = useState<string | null>(null);
  
  const generateContent = async () => {
    // Don't proceed if no generator slug is provided
    if (!generatorSlug) {
      console.error("No generator slug provided");
      showGenerationToasts(false, fieldName, false, "Please select a generator first");
      return;
    }
    
    try {
      setIsGenerating(true);
      setUsedPrompt(null);
      showGenerationToasts(true, fieldName);
      
      console.log(`Generating content for ${fieldName} using generator: ${generatorSlug}`);
      console.log(`Parameters:`, parameters);
      
      // Use the Supabase client to invoke the function directly
      const { data, error } = await supabase.functions.invoke('generate-with-ai-settings', {
        body: {
          slug: generatorSlug,
          parameters,
          responseFormat
        }
      });
      
      // Check if there was an error with the function invocation
      if (error) {
        console.error(`Edge function error for ${fieldName}:`, error);
        throw new Error(error.message || `Failed to generate ${fieldName}`);
      }
      
      // Check if we have data and content
      if (!data || !data.content) {
        console.error(`No content returned from edge function for ${fieldName}:`, data);
        throw new Error(`No content generated for ${fieldName}`);
      }
      
      console.log(`Content generated successfully:`, data.content.substring(0, 100) + "...");
      
      // Save the processed prompt if it's available in the response
      if (data.metadata && data.metadata.processedPrompt) {
        setUsedPrompt(data.metadata.processedPrompt);
      }
      
      // Set the content value in the form directly to trigger UI update
      form.setValue(fieldName, data.content, { shouldDirty: true });
      
      // Call the callback with generated content
      if (onContentGenerated) {
        onContentGenerated(data.content);
      }
      
      showGenerationToasts(false, fieldName);
    } catch (error: any) {
      console.error(`Error generating ${fieldName}:`, error);
      showGenerationToasts(false, fieldName, false, error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateContent,
    usedPrompt
  };
};
