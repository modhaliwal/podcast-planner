
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
    const { 
      topic, 
      prompt, 
      systemPrompt,
      contextInstructions,
      exampleOutput
    } = requestData;
    
    if (!topic) {
      throw new Error("Topic is required");
    }
    
    console.log(`Generating episode notes for topic: ${topic}`);
    
    // Build the full prompt with context and examples if provided
    let promptToUse = prompt || 
      `Generate comprehensive research notes about "${topic}" for a podcast episode.`;
    
    // Add context if provided
    if (contextInstructions) {
      promptToUse += `\n\nContext: ${contextInstructions}`;
    }
    
    // Add example if provided
    if (exampleOutput) {
      promptToUse += `\n\nPlease format your response similar to this example:\n${exampleOutput}`;
    }
    
    // Generate research based on the topic with the provided or default prompt
    const generatedNotes = await generateResearchWithPerplexity(
      "Topic Research",
      "Episode Research",
      undefined,
      promptToUse,
      systemPrompt
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
