
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/toast";

/**
 * Prepares the request body for content generation
 */
export const prepareRequestBody = (
  formValues: any,
  prompt: string | undefined,
  systemPrompt: string | undefined,
  contextInstructions: string | undefined,
  exampleOutput: string | undefined,
  additionalContext: Record<string, any> = {},
  generationType: string = "bio",
  preferredProvider?: string
) => {
  // Prepare social links properly (ensuring it's an object, not undefined)
  const socialLinks = formValues.socialLinks || 
                      additionalContext?.guest?.socialLinks || 
                     {
                       twitter: formValues.twitter || '',
                       facebook: formValues.facebook || '',
                       linkedin: formValues.linkedin || '',
                       instagram: formValues.instagram || '',
                       website: formValues.website || '',
                       youtube: formValues.youtube || '',
                       tiktok: formValues.tiktok || ''
                     };
  
  // Prepare the request body - make sure to include required fields
  return {
    type: generationType,  // Always include type (required by the edge function)
    name: formValues.name || additionalContext?.guest?.name,  // Include name from form or guest
    title: formValues.title || additionalContext?.guest?.title,  // Include title
    company: formValues.company || additionalContext?.guest?.company,
    socialLinks: socialLinks,
    prompt: prompt,
    systemPrompt: systemPrompt,
    contextInstructions: contextInstructions,
    exampleOutput: exampleOutput,
    preferredProvider,
    ...additionalContext  // Add all other context
  };
};

/**
 * Generates content using the specified edge function
 */
export const generateContentWithEdgeFunction = async (
  edgeFunctionName: string,
  requestBody: any,
  fieldName: string
) => {
  // Call the edge function
  const { data, error } = await supabase.functions.invoke(edgeFunctionName, {
    body: requestBody
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Extract generated content from response
  // The field name in the response should match the configured field name
  let generatedContent;
  
  if (data?.[fieldName]) {
    generatedContent = data[fieldName];
  } else if (data?.content) {
    generatedContent = data.content;
  } else if (data?.generatedContent) {
    generatedContent = data.generatedContent;
  } else if (data?.bio) {
    generatedContent = data.bio;
  } else if (data?.research) {
    generatedContent = data.research;
  } else if (data?.notes) {
    generatedContent = data.notes;
  } else if (typeof data === 'string') {
    generatedContent = data;
  }
  
  if (!generatedContent) {
    throw new Error(`No ${fieldName} generated`);
  }
  
  // Log metadata if available
  if (data?.metadata) {
    console.log("Generation metadata:", data.metadata);
  }
  
  return generatedContent;
};

/**
 * Shows toast notifications for generation process
 */
export const showGenerationToasts = (
  isStarting: boolean,
  fieldName: string,
  success: boolean = true,
  errorMessage?: string
) => {
  if (isStarting) {
    toast({
      title: "Generating",
      description: `Generating ${fieldName}...`
    });
  } else if (success) {
    toast({
      title: "Success",
      description: `${fieldName} generated successfully!`
    });
  } else if (errorMessage) {
    toast({
      title: "Error", 
      description: `Failed to generate ${fieldName}: ${errorMessage}`,
      variant: "destructive"
    });
  }
};
