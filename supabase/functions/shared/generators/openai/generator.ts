
import { AIGeneratorConfig, AIGeneratorResponse } from '../ai.ts';

/**
 * OpenAI generator specific configuration
 */
export interface OpenAIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

/**
 * Default OpenAI configuration
 */
export const DEFAULT_OPENAI_CONFIG: OpenAIConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1500
};

/**
 * Generates content using OpenAI API
 */
export async function generateWithOpenAI(config: AIGeneratorConfig): Promise<AIGeneratorResponse> {
  // Get API key directly from environment
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error("OpenAI API key is required but not provided");
  }
  
  try {
    console.log(`Generating ${config.type} content with OpenAI for ${config.name}`);
    
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
    
    // Make the API request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content.trim();
    
    console.log("Successfully generated content with OpenAI");
    
    return {
      content: generatedContent,
      metadata: {
        provider: 'openai',
        model: 'gpt-3.5-turbo'
      }
    };
  } catch (error) {
    console.error("Error generating content with OpenAI:", error);
    throw new Error(`Failed to generate content with OpenAI: ${error.message}`);
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
