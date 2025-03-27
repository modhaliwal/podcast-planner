
/**
 * Interface for Perplexity API configuration
 */
export interface PerplexityConfig {
  model: string;
  messages?: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  systemPrompt?: string;
  userPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  responseFormat?: 'text' | 'markdown' | 'html';
  returnImages?: boolean;
  returnRelatedQuestions?: boolean;
}

/**
 * Interface for Perplexity API response
 */
export interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Valid Perplexity models
 */
export const PERPLEXITY_VALID_MODELS = [
  'llama-3.1-sonar-small-128k',
  'llama-3.1-sonar-large-128k',
  'llama-3.1-sonar-small-128k-online',
  'llama-3.1-sonar-large-128k-online',
  'mixtral-8x7b-instruct',
  'sonar-small-chat',
  'sonar-medium-chat'
];
