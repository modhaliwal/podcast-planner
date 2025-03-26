
/**
 * Functions for parsing raw Perplexity API responses
 */
import { formatMarkdownWithMedia } from "./markdownFormatter.ts";

/**
 * Processes the raw API response from Perplexity
 */
export function processApiResponse(data: any): any {
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
export function parseResponseContent(messageContent: any): any {
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
    
    // Clean up the content to ensure it's valid markdown
    bodyContent = cleanupMarkdown(bodyContent);
    
    return {
      content: bodyContent,
      references,
      images
    };
  } catch (error) {
    console.error("Error parsing response content:", error);
    throw new Error(`Failed to parse response: ${error.message}`);
  }
}

/**
 * Cleans up markdown to ensure it can be properly converted to HTML
 */
function cleanupMarkdown(markdown: string): string {
  // Remove any HTML tags that might be in the content already
  let cleaned = markdown.replace(/<\/?[^>]+(>|$)/g, "");
  
  // Ensure proper spacing for headings
  cleaned = cleaned.replace(/^(#{1,6})(?!\s)/gm, "$1 ");
  
  // Ensure proper spacing for lists
  cleaned = cleaned.replace(/^(-|\*|\+)(?!\s)/gm, "$1 ");
  cleaned = cleaned.replace(/^(\d+\.)(?!\s)/gm, "$1 ");
  
  // Fix common markdown issues with line breaks
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  
  // Ensure proper link format
  cleaned = cleaned.replace(/\[(.*?)\]\s*\((.*?)\)/g, "[$1]($2)");
  
  console.log("Cleaned markdown preview:", cleaned.substring(0, 100) + "...");
  
  return cleaned;
}
