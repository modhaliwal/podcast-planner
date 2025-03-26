
/**
 * Configuration for Perplexity API requests
 */
export interface PerplexityConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  returnImages: boolean;
  returnRelatedQuestions: boolean;
}

/**
 * Response format for Perplexity API
 */
export interface PerplexityResponse {
  Body: string;
  References: string[];
  Images: string[];
}
