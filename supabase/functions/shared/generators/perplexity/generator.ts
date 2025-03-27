
import { AIGeneratorConfig, AIGeneratorResponse } from '../ai.ts';
import { DEFAULT_CONFIG, createConfig } from './config.ts';
import { processApiResponse } from './responseParser.ts';
import { convertMarkdownToHtml } from '../../utils/markdownConverter.ts';

/**
 * Generates content using Perplexity API
 */
export async function generateWithPerplexity(config: AIGeneratorConfig): Promise<AIGeneratorResponse> {
  // Get API key directly from environment
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!perplexityApiKey) {
    throw new Error("Perplexity API key is required but not provided");
  }
  
  try {
    console.log(`Generating ${config.type} content with Perplexity for ${config.name}`);
    
    // Format company information if available
    const companyInfo = config.company ? `at ${config.company}` : "";
    
    // Create system and user prompts based on content type
    const systemPrompt = config.systemPrompt || getDefaultSystemPrompt(config.type);
    const userPrompt = config.prompt || config.contextInstructions || getDefaultUserPrompt(
      config.type, 
      config.name, 
      config.title, 
      companyInfo
    );
    
    console.log(`Using ${config.systemPrompt ? 'custom' : 'default'} system prompt`);
    console.log(`Using ${config.prompt ? 'custom' : 'default'} user prompt`);
    
    // Determine which model to use - use specified model or default
    const model = config.model_name || DEFAULT_CONFIG.model;
    console.log(`Using Perplexity model: ${model}`);
    
    // Configure the Perplexity API request
    const perplexityConfig = createConfig({
      model: model,
      temperature: DEFAULT_CONFIG.temperature,
      maxTokens: DEFAULT_CONFIG.maxTokens,
      returnImages: DEFAULT_CONFIG.returnImages,
      returnRelatedQuestions: DEFAULT_CONFIG.returnRelatedQuestions
    });
    
    // Make the API call
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: perplexityConfig.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: perplexityConfig.temperature,
        max_tokens: perplexityConfig.maxTokens,
        return_images: perplexityConfig.returnImages,
        return_related_questions: perplexityConfig.returnRelatedQuestions,
        response_format: { type: "json_object" }
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error status:", response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Process the response
    let markdown = "";
    let metadata: any = {
      provider: 'perplexity',
      model: model
    };
    
    try {
      // Process structured response
      const result = processApiResponse(data);
      markdown = result.content || '';
      
      // Add references and images to metadata if available
      if (result.references) metadata.references = result.references;
      if (result.images) metadata.images = result.images;
    } catch (e) {
      console.error("Error processing structured response:", e);
      // Fallback to direct content extraction
      markdown = data.choices?.[0]?.message?.content || '';
    }
    
    console.log("Successfully generated markdown content with Perplexity");
    console.log("Markdown preview:", markdown.substring(0, 100) + "...");
    
    // Convert markdown to HTML - using the imported converter that works in Deno
    try {
      const html = await convertMarkdownToHtml(markdown);
      console.log("Successfully converted markdown to HTML");
      
      return {
        content: html,
        markdown: markdown, // Keep the original markdown for reference if needed
        metadata
      };
    } catch (error) {
      console.error("Error converting markdown to HTML:", error);
      // Return markdown as content in case of HTML conversion failure
      return {
        content: markdown,
        markdown: markdown,
        metadata
      };
    }
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
      return "You are a skilled researcher specializing in preparing background information for podcast hosts. Your research is thorough, well-organized, and helps hosts conduct great interviews. Format your response in clean markdown using ## for section headings, bullet points with *, and proper markdown syntax for emphasis.";
    case 'notes':
      return "You are an AI assistant tasked with preparing comprehensive episode notes for a podcast. Create well-structured, informative notes that cover the main topics to be discussed.";
    default:
      return "You are a helpful AI assistant tasked with generating professional content.";
  }
}

/**
 * Gets the default user prompt based on content type
 */
function getDefaultUserPrompt(
  type: string, 
  name: string, 
  title: string, 
  companyInfo: string
): string {
  switch (type) {
    case 'bio':
      return `Create a professional bio for ${name}, who works as ${title} ${companyInfo}.`;
    case 'research':
      return `Create detailed background research on ${name}, who is a ${title} ${companyInfo}, for a podcast interview.
            
      Format the output as well-structured markdown with proper headings (##), lists (*, -), and sections.
      
      Include the following sections:
      - Educational background and career journey
      - Notable accomplishments and expertise areas
      - Previous media appearances and speaking style
      - Recent projects or publications
      - Social media presence and online engagement
      - Recommended topics to explore in the interview`;
    case 'notes':
      return `Generate comprehensive research notes about "${name}" for a podcast episode.`;
    default:
      return `Generate professional content about ${name}, who works as ${title} ${companyInfo}.`;
  }
}
