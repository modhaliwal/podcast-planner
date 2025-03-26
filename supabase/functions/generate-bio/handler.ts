
import { corsHeaders } from "../shared/utils.ts";
import { extractContentFromLinks } from "../shared/content/extraction.ts";
import { generateBioWithOpenAI, generateResearchWithOpenAI } from "../shared/generators/openai.ts";
import { generateResearchWithPerplexity } from "../shared/generators/perplexity/index.ts";

// Simple validation function defined directly in this file
function validateRequestData(data: any) {
  const { 
    type, 
    name, 
    title, 
    socialLinks,
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
  
  return data;
}

export async function handleRequest(req: Request) {
  try {
    // Parse the request body
    const requestData = await req.json();
    const { 
      type, 
      name, 
      title, 
      company, 
      socialLinks,
      prompt,
      systemPrompt,
      contextInstructions,
      exampleOutput
    } = validateRequestData(requestData);
    
    console.log(`Processing ${type} request for ${name}, ${title} at ${company}`);
    console.log("Social links:", JSON.stringify(socialLinks));

    // Extract content from the provided links
    const extractedContent = await extractContentFromLinks(socialLinks);
    console.log("Extracted content from links");

    let result;
    if (type === 'research') {
      // Generate research using Perplexity
      result = await generateResearchWithPerplexity(
        name, 
        title, 
        company, 
        extractedContent,
        systemPrompt
      );
      return new Response(JSON.stringify({ research: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      // Build the full prompt with context and examples if provided
      let fullPrompt = prompt || `Create a professional bio for ${name}, who works as ${title} ${company ? 'at ' + company : ''}.`;
      
      // Add context if provided
      if (contextInstructions) {
        fullPrompt += `\n\nContext: ${contextInstructions}`;
      }
      
      // Add example if provided
      if (exampleOutput) {
        fullPrompt += `\n\nPlease format your response similar to this example:\n${exampleOutput}`;
      }
      
      // Generate bio using OpenAI with the custom prompt and system prompt if provided
      result = await generateBioWithOpenAI(
        name, 
        title, 
        company, 
        extractedContent, 
        fullPrompt,
        systemPrompt
      );
      
      return new Response(JSON.stringify({ bio: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error occurred" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
