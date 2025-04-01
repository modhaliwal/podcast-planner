
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { showGenerationToasts } from "../utils/generationUtils";

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
  
  const generateContent = async () => {
    try {
      setIsGenerating(true);
      showGenerationToasts(true, fieldName);
      
      console.log(`Generating content for ${fieldName} using generator: ${generatorSlug}`);
      console.log(`Parameters:`, parameters);
      
      // Call the edge function with the generator slug and parameters
      const response = await fetch(`/api/v1/edge/generate-with-ai-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: generatorSlug,
          parameters,
          responseFormat
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Edge function error for ${fieldName}:`, errorData);
        throw new Error(errorData.error || `Failed to generate ${fieldName}`);
      }
      
      const data = await response.json();
      
      if (!data.content) {
        console.error(`No content returned from edge function for ${fieldName}:`, data);
        throw new Error(`No content generated for ${fieldName}`);
      }
      
      console.log(`Content generated successfully:`, data.content.substring(0, 100) + "...");
      
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
    generateContent
  };
};
