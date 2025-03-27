
import { PerplexityConfig } from './types.ts';

/**
 * Default configuration for Perplexity API
 */
export const DEFAULT_CONFIG: PerplexityConfig = {
  model: 'llama-3.1-sonar-small-128k',
  temperature: 0.7,
  maxTokens: 4000,
  returnImages: false,
  returnRelatedQuestions: true
};

/**
 * Creates a response format object for Perplexity API
 */
export function createResponseFormat() {
  return { type: "json_object" };
}

/**
 * Creates a configuration object with custom settings
 */
export function createConfig(customConfig: Partial<PerplexityConfig> = {}): PerplexityConfig {
  return {
    ...DEFAULT_CONFIG,
    ...customConfig
  };
}
