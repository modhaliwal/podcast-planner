
/**
 * Configuration type for Perplexity API
 */
export interface PerplexityConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  returnImages: boolean;
  returnRelatedQuestions: boolean;
}

/**
 * Response format from Perplexity API
 */
export interface PerplexityResponse {
  Body?: string;
  content?: string;
  References?: string[];
  Images?: string[];
  [key: string]: any;
}
