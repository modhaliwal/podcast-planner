
import { PerplexityConfig } from './types.ts';

/**
 * Makes a request to the Perplexity API
 */
export async function makePerplexityRequest(apiKey: string, config: PerplexityConfig) {
  const url = 'https://api.perplexity.ai/chat/completions';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(config)
    });
    
    return response;
  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    throw new Error(`Failed to call Perplexity API: ${error.message}`);
  }
}
