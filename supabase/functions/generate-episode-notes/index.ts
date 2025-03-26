
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../shared/utils.ts"
import { generateResearchWithPerplexity } from "../shared/generators/perplexity/index.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, guestBios } = await req.json();
    
    if (!topic) {
      throw new Error("Topic is required");
    }
    
    if (!guestBios || !guestBios.length) {
      throw new Error("At least one guest bio is required");
    }
    
    // Prepare the prompt for Perplexity
    const combinedGuestInfo = guestBios.map((g: { name: string, bio: string }) => 
      `${g.name}: ${g.bio}`
    ).join('\n\n');
    
    console.log(`Generating episode notes for topic: ${topic}`);
    console.log(`Number of guests: ${guestBios.length}`);
    
    // Use the name and title of the first guest for the API call
    // but include all guest information in the extracted content
    const firstGuest = guestBios[0];
    const generatedNotes = await generateResearchWithPerplexity(
      firstGuest.name,
      "Podcast Guest",
      undefined,
      `Topic for this episode: ${topic}\n\nGuest Information:\n${combinedGuestInfo}`
    );

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
