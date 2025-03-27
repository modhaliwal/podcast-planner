import { AIGeneratorConfig, AIGeneratorResponse } from '../ai.ts';
import { makePerplexityRequest } from './api.ts';
import { DEFAULT_CONFIG, createConfig } from './config.ts';
import { processApiResponse } from './responseParser.ts';
import { convertMarkdownToHtml } from '../../utils/markdownConverter.ts';

/**
 * Generates content using Perplexity API
 */
export async function generateWithPerplexity(config: AIGeneratorConfig): Promise<AIGeneratorResponse> {
  // Get API key directly from environment
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) {
    throw new Error("Perplexity API key is required but not provided");
  }
  
  try {
    console.log(`Generating ${config.type} content with Perplexity for ${config.name}`);
    
    // Format company information if available
    const companyInfo = config.company ? `at ${config.company}` : "";
    
    // Create system and user prompts based on content type
    const systemPrompt = config.systemPrompt || getDefaultSystemPrompt(config.type);
    const userPrompt = config.prompt || getDefaultUserPrompt(
      config.type, 
      config.name, 
      config.title, 
      companyInfo,
      config.contextInstructions || ""
    );
    
    console.log(`Using ${config.systemPrompt ? 'custom' : 'default'} system prompt`);
    console.log(`Using ${config.prompt ? 'custom' : 'default'} user prompt`);
    
    // Get model from config or perplexityConfig or default
    let model = '';
    
    if (config.perplexityConfig?.model) {
      model = config.perplexityConfig.model;
    } else if (config.model_name) {
      model = config.model_name;
    } else {
      model = DEFAULT_CONFIG.model;
    }
    
    console.log(`Using Perplexity model: ${model}`);
    
    // Configure the Perplexity API request
    const perplexityConfig = createConfig({
      ...config.perplexityConfig,
      model,
      systemPrompt,
      userPrompt
    });
    
    // Call the Perplexity API
    const apiResponse = await makePerplexityRequest(apiKey, perplexityConfig);
    
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("Perplexity API error status:", apiResponse.status, JSON.stringify(errorData));
      throw new Error(`Perplexity API error: ${apiResponse.status} - ${JSON.stringify(errorData)}`);
    }
    
    // Process the response
    const data = await apiResponse.json();
    const processedResponse = processApiResponse(data);
    
    // Convert markdown to HTML if needed
    let content = processedResponse.content;
    let markdown = content;
    
    // If the response format is HTML and the content is in markdown, convert it
    if (perplexityConfig.responseFormat === 'html' && content) {
      content = await convertMarkdownToHtml(content);
    }
    
    return {
      content,
      markdown,
      metadata: {
        ...processedResponse.metadata,
        provider: 'perplexity',
        model
      }
    };
  } catch (error) {
    console.error("Error generating content with Perplexity:", error);
    throw new Error(`Failed to generate content with Perplexity: ${error.message}`);
  }
}

/**
 * Gets the default system prompt based on content type
 */
function getDefaultSystemPrompt(type: string): string {
  switch (type) {
    case 'bio':
      return "You are an AI assistant tasked with writing professional biographies. Create concise, professional bios that highlight expertise and experience.";
    case 'research':
      return "You are an AI research assistant tasked with preparing background information on podcast guests. Create detailed, well-organized research notes that will help the podcast host prepare for an interview.";
    case 'notes':
      return "You are an AI assistant tasked with preparing comprehensive episode notes for a podcast. Create well-structured, informative notes that cover the main topics to be discussed.";
    default:
      return "You are a helpful AI assistant tasked with generating professional content.";
  }
}

/**
 * Gets the default user prompt based on content type and context
 */
function getDefaultUserPrompt(
  type: string, 
  name: string, 
  title: string, 
  companyInfo: string,
  additionalContext: string
): string {
  const contextSection = additionalContext ? `\n\nAdditional context:\n${additionalContext}` : '';
  
  switch (type) {
    case 'bio':
      return `Create a professional bio for ${name}, who works as ${title} ${companyInfo}.${contextSection}`;
    case 'research':
      return `Prepare comprehensive background research on ${name}, who works as ${title} ${companyInfo}. Include education, career highlights, notable achievements, and areas of expertise.${contextSection}`;
    case 'notes':
      return `Create comprehensive notes for a podcast episode about ${name || "the given topic"}.${contextSection}`;
    default:
      return `Generate professional content about ${name}, who works as ${title} ${companyInfo}.${contextSection}`;
  }
}
