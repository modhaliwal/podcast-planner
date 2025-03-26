
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../shared/utils.ts"
import { AIGeneratorConfig } from "../shared/generators/ai.ts";

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
    let fullPrompt = prompt || 
      `Generate comprehensive research notes about "${topicToResearch}" for a podcast episode.`;
    
    // Add guest information if available
    if (guests && guests.length > 0) {
      const guestNames = guests.map(g => g.fullName || g.name || 'Unknown Guest').join(', ');
      fullPrompt += `\n\nThis episode features the following guests: ${guestNames}.`;
      
      // Add guest details if available
      guests.forEach(guest => {
        if (guest.bio) {
          fullPrompt += `\n\n${guest.fullName || guest.name}'s bio: ${guest.bio}`;
        }
        if (guest.expertise) {
          fullPrompt += `\n\n${guest.fullName || guest.name}'s expertise: ${guest.expertise}`;
        }
      });
    }
    
    // Add context if provided
    if (contextInstructions) {
      console.log("Adding context instructions to prompt");
      fullPrompt += `\n\nContext: ${contextInstructions}`;
    }
    
    // Add example if provided
    if (exampleOutput) {
      console.log("Adding example output to prompt");
      fullPrompt += `\n\nPlease format your response similar to this example:\n${exampleOutput}`;
    }
    
    console.log("Final prompt:", fullPrompt);
    
    // Create the AI generator config
    const config: AIGeneratorConfig = {
      type: 'notes',
      name: topicToResearch,
      title: `Notes for "${episode.title || topicToResearch}"`,
      prompt: fullPrompt,
      systemPrompt,
      contextInstructions,
      exampleOutput,
      episode
    };
    
    // Import and use the AI generator
    const { generateContent } = await import("../shared/generators/ai.ts");
    const result = await generateContent(config, 'perplexity');

    console.log("Successfully generated notes, returning response");
    console.log("Generated note preview:", result.content.substring(0, 200) + "...");

    return new Response(
      JSON.stringify({ 
        notes: result.content,
        metadata: result.metadata
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
