
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    // Parse the request body
    const { name, title, company, socialLinks } = await req.json();
    console.log(`Generating bio for ${name}, ${title} at ${company}`);
    console.log("Social links:", JSON.stringify(socialLinks));

    if (!openAIApiKey) {
      console.error("OpenAI API key is not configured");
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured" }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Extract content from the provided links
    const extractedContent = await extractContentFromLinks(socialLinks);
    console.log("Successfully extracted content from links");

    // Generate bio using OpenAI
    const bio = await generateBioWithOpenAI(name, title, company, extractedContent);
    
    // Return the generated bio
    return new Response(JSON.stringify({ bio }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error generating bio:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error occurred" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function extractContentFromLinks(socialLinks: Record<string, string>) {
  const validLinks = Object.values(socialLinks).filter(link => link && link.startsWith('http'));
  let extractedContent = '';

  if (validLinks.length === 0) {
    return "No valid links provided for content extraction.";
  }

  try {
    // We'll limit to 3 links for performance and cost reasons
    const linksToProcess = validLinks.slice(0, 3);
    
    for (const link of linksToProcess) {
      try {
        // Fetch the content from the link
        console.log(`Fetching content from ${link}`);
        const response = await fetch(link);
        if (!response.ok) {
          console.log(`Failed to fetch ${link}: ${response.status}`);
          continue;
        }
        
        const html = await response.text();
        
        // Very basic text extraction - in a production app, you'd want a proper HTML parser
        const textContent = html.replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 2000); // Limit to first 2000 chars
        
        extractedContent += `Content from ${link}: ${textContent}\n\n`;
      } catch (error) {
        console.error(`Failed to extract content from ${link}:`, error);
        // Continue with other links if one fails
      }
    }

    return extractedContent || "Failed to extract meaningful content from provided links.";
  } catch (error) {
    console.error("Error in content extraction:", error);
    return "Error extracting content from links.";
  }
}

async function generateBioWithOpenAI(
  name: string, 
  title: string, 
  company: string | undefined,
  extractedContent: string
) {
  if (!openAIApiKey) {
    throw new Error("OpenAI API key is not configured.");
  }

  const companyInfo = company ? `at ${company}` : "";
  
  try {
    console.log("Calling OpenAI API to generate bio");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using a smaller model to keep costs lower
        messages: [
          {
            role: "system",
            content: "You are a professional bio writer for podcast guests. Create concise, engaging bios based on provided information."
          },
          {
            role: "user",
            content: `Write a professional bio for ${name}, who is a ${title} ${companyInfo}. 
            Keep it under 150 words, professional in tone, and highlighting their expertise.
            Here's some additional information extracted from their online presence:
            
            ${extractedContent}
            
            Focus on their professional accomplishments, expertise areas, and what makes them a valuable podcast guest.`
          }
        ],
        max_tokens: 350,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(`OpenAI API error: ${data.error.message || data.error}`);
    }
    
    // Extract the generated bio from the completion
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected response format from OpenAI:", data);
      throw new Error("Unexpected response format from OpenAI");
    }
    
    const generatedBio = data.choices[0].message.content.trim();
    console.log("Successfully generated bio with OpenAI");
    return generatedBio;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error(`Failed to generate bio with AI: ${error.message}`);
  }
}
