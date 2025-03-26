
import { corsHeaders } from "../utils.ts";

/**
 * Extracts content from a list of social media links
 */
export async function extractContentFromLinks(socialLinks: Record<string, string> | null | undefined) {
  // If socialLinks is undefined or null, return an empty message
  if (!socialLinks) {
    return "No social links provided for content extraction.";
  }
  
  const validLinks = Object.values(socialLinks).filter(link => link && link.startsWith('http'));
  
  if (validLinks.length === 0) {
    return "No valid links provided for content extraction.";
  }

  try {
    // We'll limit to 10 links for performance and cost reasons
    const linksToProcess = validLinks.slice(0, 10);
    let extractedContent = '';
    
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
