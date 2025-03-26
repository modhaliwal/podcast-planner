
/**
 * Hook for parsing markdown content to HTML
 * This is a simple implementation since we now convert markdown to HTML on the server side
 */
export function useMarkdownParser(content: string): string {
  // If content is empty or not a string, return empty string
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Since markdown is now converted to HTML on the server side,
  // we just return the content as is - it should already be HTML
  return content;
}
