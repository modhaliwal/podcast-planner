
import { validateOpenAIApiKey } from "../utils.ts";

export async function generateBioWithOpenAI(
  name: string,
  title: string,
  company: string | undefined,
  extractedContent: string,
  customPrompt?: string,
  customSystemPrompt?: string
) {
  // Validate API Key
  const apiKey = validateOpenAIApiKey();

  try {
    // Format the company information
    const companyInfo = company ? `at ${company}` : "";

    // Create default or use custom system prompt
    const systemPrompt = customSystemPrompt || 
      "You are an AI assistant tasked with writing professional biographies. Create concise, professional bios that highlight expertise and experience.";

    // Create default or use custom user prompt
    const userPrompt = customPrompt || 
      `Create a professional bio for ${name}, who works as ${title} ${companyInfo}. Use the following extracted content from their online profiles to create a comprehensive bio: \n\n${extractedContent}`;

    // Make the API request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating bio with OpenAI:", error);
    throw error;
  }
}

export async function generateResearchWithOpenAI(
  name: string,
  title: string,
  company: string | undefined,
  extractedContent: string
) {
  // Validate API Key
  const apiKey = validateOpenAIApiKey();

  try {
    // Format the company information
    const companyInfo = company ? `at ${company}` : "";

    // Create the prompts
    const systemPrompt = "You are an AI research assistant tasked with preparing background information on podcast guests. Create detailed, well-organized research notes that will help the podcast host prepare for an interview.";
    const userPrompt = `Prepare comprehensive background research on ${name}, who works as ${title} ${companyInfo}. Use the following extracted content from their online profiles to create detailed research notes: \n\n${extractedContent}`;

    // Make the API request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating research with OpenAI:", error);
    throw error;
  }
}
