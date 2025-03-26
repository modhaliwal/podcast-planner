
import { validatePerplexityApiKey } from "../../utils.ts";
import { DEFAULT_CONFIG, createSystemPrompt, createUserPrompt } from "./config.ts";
import { callPerplexityAPI } from "./api.ts";
import { processApiResponse } from "./responseParser.ts";

/**
 * Generates research content using Perplexity API
 */
export async function generateResearchWithPerplexity(
  name: string, 
  title: string, 
  company: string | undefined,
  extractedContent: string,
  customSystemPrompt?: string
) {
  // Validate API key
  const perplexityApiKey = validatePerplexityApiKey();
  
  // Format company information
  const companyInfo = company ? `at ${company}` : "";
  
  try {
    // Create prompts - use custom system prompt if provided
    const systemPrompt = customSystemPrompt || createSystemPrompt();
    const userPrompt = createUserPrompt(name, title, companyInfo, extractedContent);
    
    // Call API
    const data = await callPerplexityAPI(
      systemPrompt, 
      userPrompt, 
      DEFAULT_CONFIG, 
      perplexityApiKey
    );
    
    // Process response
    const generatedResearch = processApiResponse(data);
    
    console.log("Successfully generated research with Perplexity");
    return generatedResearch;
  } catch (error) {
    console.error("Error calling Perplexity for research:", error);
    throw new Error(`Failed to generate research with Perplexity: ${error.message}`);
  }
}

// Export functions from the new modules for convenience
export { processApiResponse } from "./responseParser.ts";
export { formatMarkdownWithMedia } from "./markdownFormatter.ts";
