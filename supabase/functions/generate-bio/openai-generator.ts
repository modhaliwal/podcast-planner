
import { validateApiKey } from "./utils.ts";

export async function generateBioWithOpenAI(
  name: string, 
  title: string, 
  company: string | undefined,
  extractedContent: string
) {
  const openAIApiKey = validateApiKey();
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

export async function generateResearchWithOpenAI(
  name: string, 
  title: string, 
  company: string | undefined,
  extractedContent: string
) {
  const openAIApiKey = validateApiKey();
  const companyInfo = company ? `at ${company}` : "";
  
  try {
    console.log("Calling OpenAI API to generate research");
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
            content: "You are a skilled researcher specializing in preparing background information for podcast hosts. Your research is thorough, well-organized, and helps hosts conduct great interviews."
          },
          {
            role: "user",
            content: `Create detailed background research on ${name}, who is a ${title} ${companyInfo}, for a podcast interview.
            
            Format the output as HTML with proper headings (h3), lists (ul/ol), and structure.
            
            Include the following sections:
            - Educational background and career journey
            - Notable accomplishments and expertise areas
            - Previous media appearances and speaking style
            - Recent projects or publications
            - Social media presence and online engagement
            - Recommended topics to explore in the interview
            
            Here's information extracted from their online presence to help you:
            
            ${extractedContent}
            
            Create a comprehensive but scannable research document that will help the podcast host prepare for a great interview.`
          }
        ],
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(`OpenAI API error: ${data.error.message || data.error}`);
    }
    
    // Extract the generated research from the completion
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected response format from OpenAI:", data);
      throw new Error("Unexpected response format from OpenAI");
    }
    
    const generatedResearch = data.choices[0].message.content.trim();
    console.log("Successfully generated research with OpenAI");
    return generatedResearch;
  } catch (error) {
    console.error("Error calling OpenAI for research:", error);
    throw new Error(`Failed to generate research with AI: ${error.message}`);
  }
}
