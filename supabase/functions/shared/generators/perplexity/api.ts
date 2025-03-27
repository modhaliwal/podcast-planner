
import { PerplexityConfig } from "./types.ts";

/**
 * Makes the API request to Perplexity
 */
export async function callPerplexityAPI(
  systemPrompt: string,
  userPrompt: string,
  config: PerplexityConfig,
  apiKey: string
) {
  console.log(`Calling Perplexity API to generate content using model: ${config.model}`);
  
  // Prepare request body
  const requestBody: any = {
    model: config.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    return_images: config.returnImages,
    return_related_questions: config.returnRelatedQuestions
  };
  
  // Only add response_format for models that support it
  // llama-3 models support "text" format
  if (config.model.includes("llama-3")) {
    requestBody.response_format = { type: "text" };
  } 
  // sonar models don't need response_format specified
  
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Perplexity API error status:", response.status, errorText);
    throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
