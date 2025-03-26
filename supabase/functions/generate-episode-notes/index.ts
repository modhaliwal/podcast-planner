
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../shared/utils.ts"
import { generateResearchWithPerplexity } from "../shared/generators/perplexity/index.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { topic, prompt } = requestData;
    
    if (!topic) {
      throw new Error("Topic is required");
    }
    
    console.log(`Generating episode notes for topic: ${topic}`);
    
    // Use the provided custom prompt if available, otherwise use a default prompt
    const promptToUse = prompt || 
      `Generate comprehensive research notes about "${topic}" for a podcast episode. 
      
      Focus on:
      - Recent trends and developments in this area
      - Unique facts and surprising statistics 
      - Historical context and future outlook
      - Common misconceptions or debates
      - Notable experts or voices in this field
      
      Structure the information in well-organized sections with clear headings. Include specific data points and quotable facts that would make engaging talking points for podcast hosts.`;
    
    // Generate research based on the topic with the provided or default prompt
    const generatedNotes = await generateResearchWithPerplexity(
      "Topic Research",
      "Episode Research",
      undefined,
      promptToUse
    );

    console.log("Successfully generated notes, returning response");

    return new Response(
      JSON.stringify({ 
        notes: generatedNotes,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-episode-notes function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
})
