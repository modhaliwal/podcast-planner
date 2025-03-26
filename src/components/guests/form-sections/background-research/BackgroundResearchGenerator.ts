
import { Guest } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAIPrompts } from "@/hooks/useAIPrompts";

/**
 * @deprecated Use BackgroundResearchGenerator.tsx component instead
 */
export async function generateBackgroundResearch(
  guest: Guest,
  setIsLoading: (isLoading: boolean) => void,
  setMarkdownToConvert: (markdown: string | undefined) => void,
  getPromptByKey: (key: string) => { 
    prompt_text: string;
    system_prompt?: string;
    context_instructions?: string;
    example_output?: string;
  } | undefined
) {
  try {
    const { name, title, company, socialLinks } = guest;
    
    if (!name || !title) {
      toast({
        title: "Warning",
        description: "Guest name and title are required to generate research"
      });
      setIsLoading(false);
      return;
    }
    
    toast({
      title: "Info",
      description: "Generating background research for guest..."
    });
    
    // Get the prompt template and additional fields
    const promptData = getPromptByKey('guest_research_generator');
    
    if (!promptData || !promptData.prompt_text) {
      throw new Error("Guest research generator prompt not found");
    }
    
    // Format company information for template
    const companyInfo = company ? `at ${company}` : "";
    
    // Replace variables in the prompt template
    const prompt = promptData.prompt_text
      .replace('${name}', name)
      .replace('${title}', title)
      .replace('${companyInfo}', companyInfo);
    
    // Build request body with all available prompt components
    const requestBody: any = {
      type: 'research',
      name,
      title,
      company,
      socialLinks,
      prompt
    };
    
    // Add optional fields if they exist
    if (promptData.system_prompt) {
      requestBody.systemPrompt = promptData.system_prompt;
    }
    
    if (promptData.context_instructions) {
      requestBody.contextInstructions = promptData.context_instructions;
    }
    
    if (promptData.example_output) {
      requestBody.exampleOutput = promptData.example_output;
    }
    
    // Call the edge function to generate the research
    const { data, error } = await supabase.functions.invoke('generate-guest-research', {
      body: requestBody
    });
    
    if (error) {
      console.error("Error calling research generator:", error);
      throw new Error(`Failed to generate research: ${error.message}`);
    }
    
    if (data && data.research) {
      // Set the markdown for conversion - this will trigger the useEffect
      // in the parent component to create a new AI version
      setMarkdownToConvert(data.research);
      toast({
        title: "Success",
        description: "Background research generated successfully"
      });
    } else if (data && data.error) {
      throw new Error(data.error);
    } else {
      throw new Error("No research content returned from API");
    }
  } catch (error: any) {
    console.error("Research generation error:", error);
    toast({
      title: "Error",
      description: `Failed to generate research: ${error.message || "Unknown error"}`,
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
}
