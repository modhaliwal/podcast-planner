
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
  // Get API key directly from environment
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!perplexityApiKey) {
    throw new Error("Perplexity API key is required but not provided");
  }
  
  // Format company information
  const companyInfo = company ? `at ${company}` : "";
  
  try {
    console.log("Generating research with Perplexity...");
    
    // Create prompts - use custom system prompt if provided
    const systemPrompt = customSystemPrompt ? customSystemPrompt : createSystemPrompt();
    console.log(`Using ${customSystemPrompt ? 'custom' : 'default'} system prompt`);
    
    const userPrompt = extractedContent;
    console.log("Using user prompt:", userPrompt.substring(0, 100) + "...");
    
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
