
// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate that required API key is set
export function validateApiKey() {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error("OpenAI API key is not configured");
  }
  return openAIApiKey;
}

// Validate that Perplexity API key is set
export function validatePerplexityApiKey() {
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!perplexityApiKey) {
    throw new Error("Perplexity API key is not configured");
  }
  return perplexityApiKey;
}

// Validate request data contains required fields
export function validateRequestData(data: any) {
  const { type = 'bio', name, title } = data;
  
  if (!name || !title) {
    throw new Error("Name and title are required");
  }
  
  return { type, name, title, company: data.company, socialLinks: data.socialLinks };
}
