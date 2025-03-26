
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateResearchWithPerplexity } from "./perplexity-generator.ts";
import { validateApiKey } from "../generate-bio/utils.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { name, title, company, socialLinks } = requestData;

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
    `;

    console.log("Generating research for:", name);
    console.log("Extracted content:", extractedContent);

    // Generate the research using Perplexity
    const research = await generateResearchWithPerplexity(
      name,
      title,
      company,
      extractedContent
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
