
/**
 * Interface for AI generator configurations
 */
export interface AIGeneratorConfig {
  type: 'bio' | 'research' | 'notes' | string;
  name: string;
  title: string;
  company?: string;
  prompt?: string;
  systemPrompt?: string;
  contextInstructions?: string;
  exampleOutput?: string;
  ai_model?: string;
  model_name?: string;
  [key: string]: any; // Allow for additional fields
}

/**
 * Common response structure for AI generators
 */
export interface AIGeneratorResponse {
  content: string;      // HTML content
  markdown?: string;    // Original markdown content if available
  metadata?: {
    model?: string;
    provider?: string;
    references?: string[];
    images?: string[];
    [key: string]: any;
  };
}

/**
 * Factory function to select the appropriate AI generator based on configuration
 */
export async function generateContent(
  config: AIGeneratorConfig, 
  preferredProvider?: 'openai' | 'perplexity' | 'claude'
): Promise<AIGeneratorResponse> {
  // Get API keys for available providers
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  const claudeApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  
  // Determine which provider to use based on preference, config setting, or available keys
  let provider = preferredProvider || config.ai_model;
  
  if (!provider) {
    // If no preference, use Perplexity for research (if key available)
    if ((config.type === 'research' || config.type === 'notes') && perplexityApiKey) {
      provider = 'perplexity';
    } else if (openaiApiKey) {
      provider = 'openai';
    } else if (perplexityApiKey) {
      provider = 'perplexity';
    } else if (claudeApiKey) {
      provider = 'claude';
    } else {
      throw new Error("No API keys available for AI content generation");
    }
  }
  
  // Check if the selected provider's API key is available
  if (provider === 'perplexity' && !perplexityApiKey) {
    console.log("Perplexity API key not available, falling back to OpenAI");
    provider = 'openai';
  }
  if (provider === 'openai' && !openaiApiKey) {
    console.log("OpenAI API key not available, falling back to Perplexity");
    provider = 'perplexity';
  }
  if (provider === 'claude' && !claudeApiKey) {
    console.log("Claude API key not available, falling back to OpenAI");
    provider = 'openai';
  }
  
  // If still no valid provider, throw an error
  if ((provider === 'perplexity' && !perplexityApiKey) || 
      (provider === 'openai' && !openaiApiKey) ||
      (provider === 'claude' && !claudeApiKey)) {
    throw new Error("No API keys available for AI content generation");
  }
  
  console.log(`Using provider: ${provider}, model: ${config.model_name || 'default'}`);
  
  try {
    // Import the appropriate generator dynamically
    if (provider === 'perplexity') {
      const { generateWithPerplexity } = await import('./perplexity/generator.ts');
      return await generateWithPerplexity(config);
    } else if (provider === 'claude') {
      const { generateWithClaude } = await import('./claude/generator.ts');
      return await generateWithClaude(config);
    } else {
      const { generateWithOpenAI } = await import('./openai/generator.ts');
      return await generateWithOpenAI(config);
    }
  } catch (error) {
    console.error(`Error with ${provider} generator:`, error);
    
    // Try fallback if primary provider fails
    if (provider === 'perplexity' && openaiApiKey) {
      console.log("Falling back to OpenAI after Perplexity failure");
      const { generateWithOpenAI } = await import('./openai/generator.ts');
      return await generateWithOpenAI(config);
    } else if (provider === 'openai' && perplexityApiKey) {
      console.log("Falling back to Perplexity after OpenAI failure");
      const { generateWithPerplexity } = await import('./perplexity/generator.ts');
      return await generateWithPerplexity(config);
    } else if ((provider === 'openai' || provider === 'perplexity') && claudeApiKey) {
      console.log(`Falling back to Claude after ${provider} failure`);
      const { generateWithClaude } = await import('./claude/generator.ts');
      return await generateWithClaude(config);
    }
    
    throw error;
  }
}
