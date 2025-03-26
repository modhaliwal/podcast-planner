
/**
 * Processes the raw API response from Perplexity
 */
export function processApiResponse(data: any): string {
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
export function formatMarkdownWithMedia(bodyContent: string, images: string[], references: string[]): string {
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
