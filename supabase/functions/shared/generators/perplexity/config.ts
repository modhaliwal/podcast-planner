
import { PerplexityConfig } from "./types.ts";

/**
 * Default configuration for Perplexity API
 */
export const DEFAULT_CONFIG: PerplexityConfig = {
  model: 'sonar',
  temperature: 0.2,
  maxTokens: 4000,
  returnImages: true,
  returnRelatedQuestions: false,
};

/**
 * Creates system prompt for the Perplexity API
 */
export function createSystemPrompt(): string {
  return "You are a skilled researcher specializing in preparing background information for podcast hosts. Your research is thorough, well-organized, and helps hosts conduct great interviews. Format your response in clean markdown using ## for section headings, bullet points with *, and proper markdown syntax for emphasis like **bold** and *italic*. Include relevant images when appropriate, embedding them directly in markdown. End your document with a table of reference links used in your research. Ensure your markdown is correctly formatted with proper spacing between sections.";
}

/**
 * Creates user prompt for the Perplexity API based on guest information
 */
export function createUserPrompt(
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
export function createResponseFormat() {
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
