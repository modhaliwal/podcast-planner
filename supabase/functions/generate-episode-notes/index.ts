
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
      episode,
      guests,
      prompt, 
      systemPrompt,
      contextInstructions,
      exampleOutput
    } = requestData;
    
    if (!episode) {
      throw new Error("Episode data is required");
    }
    
    console.log(`Generating episode notes for title: ${episode.title}, topic: ${episode.topic}`);
    
    // Determine the topic to use for research
    const topicToResearch = episode.topic || episode.title || "podcast episode";
    
    // Build the full prompt with context and examples if provided
    let promptToUse = prompt || 
      `Generate comprehensive research notes about "${topicToResearch}" for a podcast episode.`;
    
    // Add guest information if available
    if (guests && guests.length > 0) {
      const guestNames = guests.map(g => g.fullName || g.name || 'Unknown Guest').join(', ');
      promptToUse += `\n\nThis episode features the following guests: ${guestNames}.`;
      
      // Add guest details if available
      guests.forEach(guest => {
        if (guest.bio) {
          promptToUse += `\n\n${guest.fullName || guest.name}'s bio: ${guest.bio}`;
        }
        if (guest.expertise) {
          promptToUse += `\n\n${guest.fullName || guest.name}'s expertise: ${guest.expertise}`;
        }
      });
    }
    
    // Add context if provided
    if (contextInstructions) {
      console.log("Adding context instructions to prompt");
      promptToUse += `\n\nContext: ${contextInstructions}`;
    }
    
    // Add example if provided
    if (exampleOutput) {
      console.log("Adding example output to prompt");
      promptToUse += `\n\nPlease format your response similar to this example:\n${exampleOutput}`;
    }
    
    console.log("Final prompt:", promptToUse);
    
    // Generate research based on the topic with the provided or default prompt
    const generatedNotes = await generateResearchWithPerplexity(
      "Episode Research",
      `Notes for "${episode.title || topicToResearch}"`,
      undefined,
      promptToUse,
      systemPrompt
    );

    console.log("Successfully generated notes, returning response");
    console.log("Generated note preview:", generatedNotes.substring(0, 200) + "...");

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
