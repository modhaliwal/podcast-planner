
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useAIPrompts } from "@/hooks/useAIPrompts";
import { ContentGenerationConfig } from "../types";
import { 
  prepareRequestBody, 
  generateContentWithEdgeFunction, 
  showGenerationToasts 
} from "../utils/generationUtils";

export const useContentGeneration = (
  config: ContentGenerationConfig,
  form: UseFormReturn<any>
) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { getPromptByKey } = useAIPrompts();
  
  const {
    fieldName,
    promptKey,
    onContentGenerated,
    guests = [],
    additionalContext = {},
    edgeFunctionName,
    generationType = "bio",
    preferredProvider
  } = config;

  // Determine if we should disable the button based on required fields
  const shouldDisable = () => {
    // For episode notes generation, require a topic
    if (edgeFunctionName === 'generate-episode-notes') {
      const topic = additionalContext.topic || form.watch('topic');
      if (!topic) return true;
    }
    
    // Add other conditions as needed for different generation types
    
    return isGenerating;
  };

  const generateContent = async () => {
    try {
      // For episode notes, check if we have a topic
      if (edgeFunctionName === 'generate-episode-notes') {
        const topic = additionalContext.topic || form.watch('topic');
        if (!topic) {
          showGenerationToasts(false, fieldName, false, "Please add a topic before generating notes");
          return;
        }
      }
      
      setIsGenerating(true);
      showGenerationToasts(true, fieldName);
      
      // Get form data for context
      const formValues = form.getValues();
      
      // Get the prompt from AI prompts
      const prompt = await getPromptByKey(promptKey);
      
      if (!prompt) {
        console.warn(`No prompt found with key: ${promptKey}`);
      }
      
      console.log(`Generating content for ${fieldName} using ${edgeFunctionName}`);
      console.log(`Using preferred provider: ${preferredProvider || 'not specified'}`);
      
      // Prepare the request body with awaited prompt properties
      const requestBody = prepareRequestBody(
        formValues,
        prompt?.prompt_text,
        prompt?.system_prompt,
        prompt?.context_instructions,
        prompt?.example_output,
        additionalContext,
        generationType,
        preferredProvider
      );
      
      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      
      // Generate the content
      const generatedContent = await generateContentWithEdgeFunction(
        edgeFunctionName,
        requestBody,
        fieldName
      );
      
      console.log(`Content generated successfully:`, generatedContent.substring(0, 100) + "...");
      
      // Set the content value in the form directly to trigger UI update
      form.setValue(fieldName, generatedContent, { shouldDirty: true });
      
      // Call the callback with generated content
      if (onContentGenerated) {
        onContentGenerated(generatedContent);
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
    shouldDisable,
    generateContent
  };
};
