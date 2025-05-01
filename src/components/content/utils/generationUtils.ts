
import { toast } from "@/hooks/toast/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates content using a Supabase edge function
 */
export async function generateContentWithEdgeFunction(
  edgeFunctionName: string,
  requestBody: any,
  fieldName: string
): Promise<string> {
  try {
    // Use the Supabase client to invoke the function directly
    const { data, error } = await supabase.functions.invoke(edgeFunctionName, {
      body: requestBody
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
    
    return data.content;
  } catch (error: any) {
    console.error(`Error calling edge function for ${fieldName}:`, error);
    throw new Error(error.message || `Failed to generate ${fieldName}`);
  }
}

/**
 * Displays toast notifications for content generation status
 */
export function showGenerationToasts(
  isLoading: boolean,
  fieldName: string,
  isSuccess: boolean = true,
  message?: string
) {
  if (isLoading) {
    toast({
      title: "Generating content",
      description: `Generating content for ${fieldName}...`,
    });
  } else {
    if (isSuccess) {
      toast({
        title: "Content generated",
        description: `Content for ${fieldName} has been generated successfully`,
      });
    } else {
      toast({
        title: "Generation failed",
        description: message || `Failed to generate content for ${fieldName}`,
        variant: "destructive",
      });
    }
  }
}

/**
 * Prepares the request body for content generation
 */
export function prepareRequestBody(
  formValues: any,
  promptText?: string,
  systemPrompt?: string,
  contextInstructions?: string,
  exampleOutput?: string,
  additionalContext: Record<string, any> = {},
  generationType: string = 'bio',
  preferredProvider?: string
) {
  // Start with basic request data
  const requestBody: any = {
    type: generationType,
    name: formValues.name || additionalContext.name || '',
    title: formValues.title || additionalContext.title || '',
    company: formValues.company || additionalContext.company || '',
  };
  
  // Add prompt-related fields if available
  if (promptText) requestBody.prompt = promptText;
  if (systemPrompt) requestBody.systemPrompt = systemPrompt;
  if (contextInstructions) requestBody.contextInstructions = contextInstructions;
  if (exampleOutput) requestBody.exampleOutput = exampleOutput;
  
  // Add preferred provider if specified
  if (preferredProvider) {
    requestBody.ai_model = preferredProvider;
  }
  
  // Add any additional context
  Object.keys(additionalContext).forEach(key => {
    if (key !== 'name' && key !== 'title' && key !== 'company') {
      requestBody[key] = additionalContext[key];
    }
  });
  
  return requestBody;
}
