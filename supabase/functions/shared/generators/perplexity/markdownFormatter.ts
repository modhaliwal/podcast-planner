
/**
 * Format markdown content with media elements
 */
export function formatMarkdownWithMedia(
  markdown: string,
  images: string[] = []
): string {
  let formattedMarkdown = markdown;
  
  // Add images at the end if provided
  if (images && images.length > 0) {
    formattedMarkdown += "\n\n## Reference Images\n\n";
    images.forEach((imageUrl, index) => {
      formattedMarkdown += `![Image ${index + 1}](${imageUrl})\n`;
    });
  }
  
  return formattedMarkdown;
}
