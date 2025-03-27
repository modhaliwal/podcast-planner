
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
  
  try {
    // Basic extraction of content
    let content = messageContent;
    let references: string[] = [];
    let images: string[] = [];
    
    // Try to parse as JSON if it looks like JSON
    if (typeof messageContent === 'string' && messageContent.trim().startsWith('{')) {
      try {
        const parsedContent = JSON.parse(messageContent);
        if (parsedContent.Body) content = parsedContent.Body;
        if (parsedContent.References) references = parsedContent.References;
        if (parsedContent.Images) images = parsedContent.Images;
      } catch (e) {
        console.log("Content is not valid JSON, using as plain text");
      }
    } else if (typeof messageContent === 'object') {
      // Direct access to object fields
      if (messageContent.Body) content = messageContent.Body;
      if (messageContent.References) references = messageContent.References;
      if (messageContent.Images) images = messageContent.Images;
    }
    
    // Clean up the content to ensure it's valid markdown
    content = cleanupMarkdown(content);
    
    return {
      content,
      references,
      images
    };
  } catch (error) {
    console.error("Error parsing response:", error);
    return { content: messageContent };
  }
}

/**
 * Cleans up markdown to ensure it can be properly converted to HTML
 */
function cleanupMarkdown(markdown: string): string {
  if (typeof markdown !== 'string') {
    console.warn("Expected markdown string but got:", typeof markdown);
    return String(markdown);
  }
  
  // Remove any HTML tags that might be in the content already
  let cleaned = markdown.replace(/<\/?[^>]+(>|$)/g, "");
  
  // Ensure proper spacing for headings
  cleaned = cleaned.replace(/^(#{1,6})(?!\s)/gm, "$1 ");
  
  // Ensure proper spacing for lists
  cleaned = cleaned.replace(/^(-|\*|\+)(?!\s)/gm, "$1 ");
  
  return cleaned;
}
