
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateResearchWithPerplexity } from "../shared/generators/perplexity/index.ts";
import { corsHeaders, validateApiKey } from "../shared/utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get('apikey');
    validateApiKey(apiKey);

    // Parse request body
    const requestData = await req.json();
    const { 
      name, 
      title, 
      company, 
      socialLinks, 
      prompt,
      systemPrompt,
      contextInstructions,
      exampleOutput
    } = requestData;

    if (!name || !title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name and title are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract useful information from social links
    const socialProfiles = Object.entries(socialLinks || {})
      .filter(([_, url]) => url && typeof url === 'string' && url.trim() !== '')
      .map(([platform, url]) => `${platform}: ${url}`)
      .join('\n');

    // Format extracted content for the AI
    const extractedContent = `
    Name: ${name}
    Title: ${title}
    ${company ? `Company: ${company}` : ''}
    ${socialProfiles ? `Social Media Profiles:\n${socialProfiles}` : ''}
    ${contextInstructions ? `\nAdditional Context:\n${contextInstructions}` : ''}
    ${exampleOutput ? `\nExample Format:\n${exampleOutput}` : ''}
    `;

    console.log("Generating research for:", name);
    console.log("Extracted content:", extractedContent);

    // Use the provided custom prompt if available, otherwise use the extracted content directly
    const promptToUse = prompt || extractedContent;

    // Generate the research using Perplexity with system prompt if provided
    const research = await generateResearchWithPerplexity(
      name,
      title,
      company,
      promptToUse,
      systemPrompt
    );

    return new Response(
      JSON.stringify({
        success: true,
        research: research
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in generate-guest-research function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
