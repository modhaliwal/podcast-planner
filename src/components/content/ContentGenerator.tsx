
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { Guest } from "@/lib/types";
import { useAIPrompts } from "@/hooks/useAIPrompts";

export interface ContentGenerationConfig {
  // Core configuration
  fieldName: string;                        // Form field name to update
  promptKey: string;                        // Key for retrieving prompt from AI prompts
  buttonLabel?: string;                     // Custom button label
  loadingLabel?: string;                    // Custom loading label
  onContentGenerated?: (content: string) => void; // Optional callback
  
  // Context data
  guests?: Guest[];                         // Optional guests data for context
  additionalContext?: Record<string, any>;  // Additional context data
  
  // Edge function configuration
  edgeFunctionName: string;                 // Name of the Supabase edge function
  generationType?: "bio" | "research";      // Type of generation (for edge functions that support multiple types)
}

interface ContentGeneratorProps {
  config: ContentGenerationConfig;
  form: UseFormReturn<any>;
}

export function ContentGenerator({ 
  config,
  form
}: ContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { getPromptByKey } = useAIPrompts();
  
  const {
    fieldName,
    promptKey,
    buttonLabel = "Generate",
    loadingLabel = "Generating...",
    onContentGenerated,
    guests = [],
    additionalContext = {},
    edgeFunctionName,
    generationType
  } = config;

  const generateContent = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating",
        description: `Generating ${fieldName}...`
      });
      
      // Get form data for context
      const formValues = form.getValues();
      
      // Get the prompt from AI prompts
      const prompt = getPromptByKey(promptKey);
      
      if (!prompt) {
        console.warn(`No prompt found with key: ${promptKey}`);
      }
      
      console.log(`Generating content for ${fieldName} using ${edgeFunctionName}`);
      
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
      const requestBody: any = {
        type: generationType,  // Always include type (required by the edge function)
        name: formValues.name || additionalContext?.guest?.name,  // Include name from form or guest
        title: formValues.title || additionalContext?.guest?.title,  // Include title
        company: formValues.company || additionalContext?.guest?.company,
        socialLinks: socialLinks,
        prompt: prompt?.prompt_text,
        systemPrompt: prompt?.system_prompt,
        contextInstructions: prompt?.context_instructions,
        exampleOutput: prompt?.example_output,
        ...additionalContext  // Add all other context
      };
      
      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      
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
      } else if (typeof data === 'string') {
        generatedContent = data;
      }
      
      if (generatedContent) {
        console.log(`Content generated successfully:`, generatedContent.substring(0, 100) + "...");
        
        // Set the content value in the form directly to trigger UI update
        form.setValue(fieldName, generatedContent, { shouldDirty: true });
        
        // Call the callback with generated content
        if (onContentGenerated) {
          onContentGenerated(generatedContent);
        }
        
        toast({
          title: "Success",
          description: `${fieldName} generated successfully!`
        });
      } else {
        throw new Error(`No ${fieldName} generated`);
      }
    } catch (error: any) {
      console.error(`Error generating ${fieldName}:`, error);
      toast({
        title: "Error", 
        description: `Failed to generate ${fieldName}: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={generateContent}
      disabled={isGenerating}
    >
      <Sparkles className="h-4 w-4 mr-1" />
      {isGenerating ? loadingLabel : buttonLabel}
    </Button>
  );
}
