
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
    // Don't proceed if no generator slug is provided
    if (!generatorSlug) {
      console.error("No generator slug provided");
      showGenerationToasts(false, fieldName, false, "Please select a generator first");
      return;
    }
    
    try {
      setIsGenerating(true);
      showGenerationToasts(true, fieldName);
      
      console.log(`Generating content for ${fieldName} using generator: ${generatorSlug}`);
      console.log(`Parameters:`, parameters);
      
      // Call the Supabase function instead of the edge API
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
      
      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse error response if possible
        let errorMessage = `Failed to generate ${fieldName} (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If we can't parse JSON, use the status text
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        
        console.error(`Edge function error for ${fieldName}:`, errorMessage);
        throw new Error(errorMessage);
      }
      
      // Make sure the response has a body before parsing
      const text = await response.text();
      if (!text || text.trim() === '') {
        throw new Error(`Empty response from server for ${fieldName}`);
      }
      
      // Parse the JSON text
      const data = JSON.parse(text);
      
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
