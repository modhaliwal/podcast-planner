
import { corsHeaders, validateRequestData } from "../shared/utils.ts";
import { extractContentFromLinks } from "../shared/content/extraction.ts";
import { generateBioWithOpenAI, generateResearchWithOpenAI } from "../shared/generators/openai.ts";
import { generateResearchWithPerplexity } from "../shared/generators/perplexity/index.ts";

export async function handleRequest(req: Request) {
  try {
    // Parse the request body
    const requestData = await req.json();
    const { type, name, title, company, socialLinks } = validateRequestData(requestData);
    
    console.log(`Processing ${type} request for ${name}, ${title} at ${company}`);
    console.log("Social links:", JSON.stringify(socialLinks));

    // Extract content from the provided links
    const extractedContent = await extractContentFromLinks(socialLinks);
    console.log("Extracted content from links");

    let result;
    if (type === 'research') {
      // Generate research using Perplexity
      result = await generateResearchWithPerplexity(name, title, company, extractedContent);
      return new Response(JSON.stringify({ research: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      // Default: Generate bio using OpenAI
      result = await generateBioWithOpenAI(name, title, company, extractedContent);
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
