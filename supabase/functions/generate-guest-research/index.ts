
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../shared/utils.ts";
import { AIGeneratorConfig } from "../shared/generators/ai.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Prepare the configuration for the AI generator
    const config: AIGeneratorConfig = {
      type: 'research',
      name,
      title,
      company,
      prompt: prompt || extractedContent,
      systemPrompt,
      contextInstructions,
      exampleOutput
    };

    // Import and use the AI generator
    const { generateContent } = await import("../shared/generators/ai.ts");
    const result = await generateContent(config, 'perplexity');

    return new Response(
      JSON.stringify({
        success: true,
        research: result.content,      // This is now HTML
        markdown: result.markdown,     // Original markdown for reference
        metadata: result.metadata
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
