
import { PerplexityConfig } from './types.ts';

/**
 * Default configuration for Perplexity API
 */
export const DEFAULT_CONFIG: PerplexityConfig = {
  model: 'llama-3.1-sonar-small-128k',
  temperature: 0.7,
  maxTokens: 4000,
  responseFormat: 'markdown',
  returnImages: false,
  returnRelatedQuestions: true
};

/**
 * Creates a configuration object with custom settings
 */
export function createConfig(customConfig: Partial<PerplexityConfig> = {}): PerplexityConfig {
  const config = {
    ...DEFAULT_CONFIG,
    ...customConfig
  };

  // Format the messages array from system and user prompts
  const messages = [];
  
  if (customConfig.systemPrompt) {
    messages.push({
      role: 'system',
      content: customConfig.systemPrompt
    });
  }
  
  if (customConfig.userPrompt) {
    messages.push({
      role: 'user',
      content: customConfig.userPrompt
    });
  }
  
  return {
    ...config,
    messages
  };
}

/**
 * Creates a system prompt for research
 */
export function createSystemPrompt(): string {
  return "You are a skilled researcher specializing in preparing background information. Your research is thorough, well-organized, and helpful. Format your response in clean markdown using ## for section headings, bullet points with *, and proper markdown syntax for emphasis.";
}

/**
 * Creates a user prompt for research
 */
export function createUserPrompt(name: string, title: string, company?: string): string {
  const companyInfo = company ? ` at ${company}` : "";
  
  return `Create detailed background research on ${name}, who is a ${title}${companyInfo}.
  
  Format the output as well-structured markdown with proper headings (##), lists (*, -), and sections.
  
  Include the following sections:
  - Educational background and career journey
  - Notable accomplishments and expertise areas
  - Previous media appearances and speaking style
  - Recent projects or publications
  - Social media presence and online engagement
  - Recommended topics to explore`;
}
