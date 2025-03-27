
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
  perplexityConfig?: any;
  parameters?: Record<string, any>; // Added parameters field
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
 * Helper function to process prompt templates with parameters
 * Replaces {paramName} tokens with the actual parameter values
 */
export function processPromptWithParameters(
  promptText: string,
  parameters: Record<string, any> = {}
): string {
  if (!promptText) return '';
  
  let processedText = promptText;
  
  // Replace all {paramName} occurrences with corresponding parameter values
  Object.entries(parameters).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    // Convert objects to strings if needed
    const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
    processedText = processedText.replace(new RegExp(placeholder, 'g'), valueStr);
  });
  
  return processedText;
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
  
  // First priority: Specific provider in the configuration's ai_model field
  let provider = config.ai_model;
  
  // Second priority: Preferred provider specified in the request
  if (!provider && preferredProvider) {
    provider = preferredProvider;
  }
  
  console.log(`Generator specifies AI model: ${provider || 'not specified'}, model_name: ${config.model_name || 'default'}`);
  
  // Third priority: Fall back to the first available API key
  if (!provider) {
    if (openaiApiKey) {
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
    provider = openaiApiKey ? 'openai' : (claudeApiKey ? 'claude' : null);
  } else if (provider === 'openai' && !openaiApiKey) {
    console.log("OpenAI API key not available, falling back to Perplexity");
    provider = perplexityApiKey ? 'perplexity' : (claudeApiKey ? 'claude' : null);
  } else if (provider === 'claude' && !claudeApiKey) {
    console.log("Claude API key not available, falling back to OpenAI");
    provider = openaiApiKey ? 'openai' : (perplexityApiKey ? 'perplexity' : null);
  }
  
  // If still no valid provider, throw an error
  if (!provider || 
      (provider === 'perplexity' && !perplexityApiKey) || 
      (provider === 'openai' && !openaiApiKey) ||
      (provider === 'claude' && !claudeApiKey)) {
    throw new Error("No API keys available for AI content generation");
  }
  
  console.log(`Using provider: ${provider}, model: ${config.model_name || 'default'}`);
  
  // Process prompts with parameters if they exist
  if (config.parameters) {
    console.log("Processing prompts with parameters");
    
    if (config.prompt) {
      config.prompt = processPromptWithParameters(config.prompt, config.parameters);
    }
    
    if (config.systemPrompt) {
      config.systemPrompt = processPromptWithParameters(config.systemPrompt, config.parameters);
    }
    
    if (config.contextInstructions) {
      config.contextInstructions = processPromptWithParameters(config.contextInstructions, config.parameters);
    }
  }
  
  try {
    // Import the appropriate generator dynamically
    if (provider === 'perplexity') {
      try {
        const { generateWithPerplexity } = await import('./perplexity/generator.ts');
        
        // Pass the model_name to the generator if specified
        if (config.model_name) {
          config.perplexityConfig = { 
            model: config.model_name 
          };
        }
        
        return await generateWithPerplexity(config);
      } catch (perplexityError) {
        console.error("Error with Perplexity generator:", perplexityError);
        if (openaiApiKey) {
          console.log("Falling back to OpenAI after Perplexity failure");
          const { generateWithOpenAI } = await import('./openai/generator.ts');
          return await generateWithOpenAI(config);
        }
        throw perplexityError;
      }
    } else if (provider === 'claude') {
      const { generateWithClaude } = await import('./claude/generator.ts');
      return await generateWithClaude(config);
    } else {
      // Default to OpenAI
      const { generateWithOpenAI } = await import('./openai/generator.ts');
      return await generateWithOpenAI(config);
    }
  } catch (error) {
    console.error(`Error with ${provider} generator:`, error);
    
    // Only try fallback if the user didn't explicitly request a specific provider
    if (!preferredProvider && !config.ai_model) {
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
    }
    
    throw error;
  }
}
