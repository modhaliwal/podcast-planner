
import { PerplexityConfig } from './types.ts';

/**
 * Makes a request to the Perplexity API
 */
export async function makePerplexityRequest(apiKey: string, config: PerplexityConfig) {
  const url = 'https://api.perplexity.ai/chat/completions';
  
  try {
    // Prepare request body, transforming our config to match Perplexity API format
    const requestBody: any = {
      model: config.model,
      messages: config.messages || []
    };
    
    // Add optional parameters if they exist
    if (config.temperature !== undefined) requestBody.temperature = config.temperature;
    if (config.maxTokens !== undefined) requestBody.max_tokens = config.maxTokens;
    if (config.topP !== undefined) requestBody.top_p = config.topP;
    if (config.topK !== undefined) requestBody.top_k = config.topK;
    if (config.presencePenalty !== undefined) requestBody.presence_penalty = config.presencePenalty;
    if (config.frequencyPenalty !== undefined) requestBody.frequency_penalty = config.frequencyPenalty;
    
    console.log("Perplexity API request:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    return response;
  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    throw new Error(`Failed to call Perplexity API: ${error.message}`);
  }
}
