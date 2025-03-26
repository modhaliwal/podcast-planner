
import { Guest } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAIPrompts } from "@/hooks/useAIPrompts";

export async function generateBackgroundResearch(
  guest: Guest,
  setIsLoading: (isLoading: boolean) => void,
  setMarkdownToConvert: (markdown: string | undefined) => void,
  getPromptByKey: (key: string) => { prompt_text: string } | undefined
) {
  try {
    const { name, title, company, socialLinks } = guest;
    
    if (!name || !title) {
      toast.warning("Guest name and title are required to generate research");
      setIsLoading(false);
      return;
    }
    
    toast.info("Generating background research for guest...");
    
    // Get the prompt template
    const promptTemplate = getPromptByKey('guest_research_generator')?.prompt_text;
    
    if (!promptTemplate) {
      throw new Error("Guest research generator prompt not found");
    }
    
    // Format company information for template
    const companyInfo = company ? `at ${company}` : "";
    
    // Replace variables in the prompt template
    const prompt = promptTemplate
      .replace('${name}', name)
      .replace('${title}', title)
      .replace('${companyInfo}', companyInfo);
    
    // Call the edge function to generate the research
    const { data, error } = await supabase.functions.invoke('generate-guest-research', {
      body: {
        name,
        title,
        company,
        socialLinks,
        prompt
      }
    });
    
    if (error) {
      console.error("Error calling research generator:", error);
      throw new Error(`Failed to generate research: ${error.message}`);
    }
    
    if (data && data.research) {
      // Set the markdown for conversion - this will trigger the useEffect
      // in the parent component to create a new AI version
      setMarkdownToConvert(data.research);
      toast.success("Background research generated successfully");
    } else if (data && data.error) {
      throw new Error(data.error);
    } else {
      throw new Error("No research content returned from API");
    }
  } catch (error: any) {
    console.error("Research generation error:", error);
    toast.error(`Failed to generate research: ${error.message || "Unknown error"}`);
  } finally {
    setIsLoading(false);
  }
}
