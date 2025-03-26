
import { validatePerplexityApiKey } from "../utils.ts";

/**
 * Configuration for Perplexity API requests
 */
interface PerplexityConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  returnImages: boolean;
  returnRelatedQuestions: boolean;
}

/**
 * Default configuration for Perplexity API
 */
const DEFAULT_CONFIG: PerplexityConfig = {
  model: 'sonar',
  temperature: 0.2,
  maxTokens: 4000,
  returnImages: true,
  returnRelatedQuestions: false,
};

/**
 * Creates system prompt for the Perplexity API
 */
function createSystemPrompt(): string {
  return "You are a skilled researcher specializing in preparing background information for podcast hosts. Your research is thorough, well-organized, and helps hosts conduct great interviews. Format your response in clean markdown using ## for section headings, bullet points with *, and proper markdown syntax for emphasis like **bold** and *italic*. Include relevant images when appropriate, embedding them directly in markdown. End your document with a table of reference links used in your research. Ensure your markdown is correctly formatted with proper spacing between sections.";
}

/**
 * Creates user prompt for the Perplexity API based on guest information
 */
function createUserPrompt(
  name: string,
  title: string,
  companyInfo: string,
  extractedContent: string
): string {
  return `Create detailed background research on ${name}, who is a ${title} ${companyInfo}, for a podcast interview.
            
  Format the output as well-structured markdown with proper headings (##), lists (*, -), and sections.
  
  Include the following sections:
  - Educational background and career journey
  - Notable accomplishments and expertise areas
  - Previous media appearances and speaking style
  - Recent projects or publications
  - Social media presence and online engagement
  - Recommended topics to explore in the interview
  
  Where appropriate, include relevant images directly embedded in markdown. End the document with a table of references used.
  
  Here's information extracted from their online presence to help you:
  
  ${extractedContent}
  
  Create a comprehensive but scannable research document that will help the podcast host prepare for a great interview.`;
}

/**
 * Creates the response format configuration for Perplexity API
 */
function createResponseFormat() {
  return {
    "type": "json_schema",
    "json_schema": {
      "schema": {
        "type": "object",
        "properties": {
          "Body": {
            "type": "string",
            "description": "The full response in Markdown format."
          },
          "References": {
            "type": "array",
            "items": {
              "type": "string",
              "format": "uri"
            },
            "description": "List of numbered source URLs referenced in the response."
          },
          "Images": {
            "type": "array",
            "items": {
              "type": "string",
              "format": "uri"
            },
            "description": "List of image URLs referenced in the response."
          }
        },
        "required": ["Body", "References", "Images"]
      }
    }
  };
}

/**
 * Makes the API request to Perplexity
 */
async function callPerplexityAPI(
  systemPrompt: string,
  userPrompt: string,
  config: PerplexityConfig,
  apiKey: string
) {
  console.log("Calling Perplexity API to generate research");
  
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      return_images: config.returnImages,
      return_related_questions: config.returnRelatedQuestions,
      response_format: createResponseFormat()
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Perplexity API error status:", response.status, errorText);
    throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Processes the raw API response from Perplexity
 */
function processApiResponse(data: any): string {
  if (data.error) {
    console.error("Perplexity API error:", data.error);
    throw new Error(`Perplexity API error: ${data.error.message || data.error}`);
  }
  
  // Check if response has expected structure
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error("Unexpected response format from Perplexity:", data);
    throw new Error("Unexpected response format from Perplexity");
  }
  
  // Extract content from the response
  const messageContent = data.choices[0].message.content;
  console.log("Raw message content type:", typeof messageContent);
  
  return parseResponseContent(messageContent);
}

/**
 * Parses the content from API response
 */
function parseResponseContent(messageContent: any): string {
  let bodyContent = "";
  let references: string[] = [];
  let images: string[] = [];
  
  try {
    if (typeof messageContent === 'string') {
      if (messageContent.trim().startsWith('{')) {
        try {
          // Try to parse as JSON if it looks like JSON
          const parsedContent = JSON.parse(messageContent);
          bodyContent = parsedContent.Body || messageContent;
          references = parsedContent.References || [];
          images = parsedContent.Images || [];
          console.log("Successfully parsed JSON string from content");
        } catch (e) {
          console.log("Failed to parse as JSON, using as plain text:", e);
          bodyContent = messageContent;
        }
      } else {
        // Not JSON format, use as is
        bodyContent = messageContent;
        console.log("Using content as plain text (not JSON)");
      }
    } else if (typeof messageContent === 'object') {
      // It's already a parsed object
      bodyContent = messageContent.Body || JSON.stringify(messageContent);
      references = messageContent.References || [];
      images = messageContent.Images || [];
      console.log("Using pre-parsed object content");
    } else {
      throw new Error("Unexpected content format");
    }
    
    return formatMarkdownWithMedia(bodyContent, images, references);
  } catch (error) {
    console.error("Error parsing response content:", error);
    throw new Error(`Failed to parse response: ${error.message}`);
  }
}

/**
 * Formats markdown with media and references
 */
function formatMarkdownWithMedia(bodyContent: string, images: string[], references: string[]): string {
  // Process images - embed directly in the markdown
  console.log(`Found ${images.length} images to embed`);
  
  let imageMarkdown = "";
  if (images.length > 0) {
    imageMarkdown += "\n\n## Visual References\n\n";
    images.forEach((imageUrl, index) => {
      imageMarkdown += `![Image ${index+1}](${imageUrl})\n\n`;
    });
  }
  
  // Check if there's a References section already and add images before it
  if (bodyContent.includes("## References") || bodyContent.includes("# References")) {
    // Insert images before references section
    bodyContent = bodyContent.replace(/(#{1,2} References)/g, `${imageMarkdown}$1`);
  } else {
    // Add images at the end if no references section
    bodyContent += imageMarkdown;
  }
  
  // Add references as a table if they don't already exist in the content
  if (references.length > 0 && 
      !bodyContent.includes("## References") && 
      !bodyContent.includes("# References")) {
    
    bodyContent += "\n\n## References\n\n";
    bodyContent += "| # | Source |\n";
    bodyContent += "|---|--------|\n";
    
    references.forEach((reference, index) => {
      bodyContent += `| ${index + 1} | [${reference}](${reference}) |\n`;
    });
  }
  
  // Log output statistics
  const wordCount = bodyContent.split(/\s+/).length;
  console.log(`Total word count: ${wordCount}`);
  console.log("Preview of generated markdown:", bodyContent.substring(0, 200) + "...");
  
  return bodyContent;
}

/**
 * Generates research content using Perplexity API
 */
export async function generateResearchWithPerplexity(
  name: string, 
  title: string, 
  company: string | undefined,
  extractedContent: string
) {
  // Validate API key
  const perplexityApiKey = validatePerplexityApiKey();
  
  // Format company information
  const companyInfo = company ? `at ${company}` : "";
  
  try {
    // Create prompts
    const systemPrompt = createSystemPrompt();
    const userPrompt = createUserPrompt(name, title, companyInfo, extractedContent);
    
    // Call API
    const data = await callPerplexityAPI(
      systemPrompt, 
      userPrompt, 
      DEFAULT_CONFIG, 
      perplexityApiKey
    );
    
    // Process response
    const generatedResearch = processApiResponse(data);
    
    console.log("Successfully generated research with Perplexity");
    return generatedResearch;
  } catch (error) {
    console.error("Error calling Perplexity for research:", error);
    throw new Error(`Failed to generate research with Perplexity: ${error.message}`);
  }
}
