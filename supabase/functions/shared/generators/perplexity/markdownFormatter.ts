
/**
 * Functions for formatting markdown content with media and references
 */

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
