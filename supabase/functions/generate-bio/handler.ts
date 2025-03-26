
import { corsHeaders } from "../shared/utils.ts";
import { AIGeneratorConfig } from "../shared/generators/ai.ts";

// Validate incoming request data
export function validateRequestData(data: any): AIGeneratorConfig {
  const { 
    type, 
    name, 
    title 
  } = data;

  if (!type) {
    throw new Error("Type is required ('bio' or 'research')");
  }
  
  if (!name) {
    throw new Error("Name is required");
  }
  
  if (!title) {
    throw new Error("Title is required");
  }
  
  return data as AIGeneratorConfig;
}

// Handle the request
export async function handleRequest(req: Request): Promise<Response> {
  try {
    // Parse the request
    const requestData = await req.json();
    console.log("Received request data:", JSON.stringify(requestData));
    
    // Validate the data
    const config = validateRequestData(requestData);
    
    // Import and use the AI generator factory
    const { generateContent } = await import("../shared/generators/ai.ts");
    
    // Generate the content based on type
    const result = await generateContent(config, requestData.preferredProvider);
    
    // Return the response based on the content type
    if (config.type === 'bio') {
      return new Response(
        JSON.stringify({ bio: result.content, metadata: result.metadata }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (config.type === 'research') {
      return new Response(
        JSON.stringify({ research: result.content, metadata: result.metadata }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ content: result.content, metadata: result.metadata }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
