
import { useState, useEffect } from 'react';
import { marked } from 'marked';

export function useMarkdownParser(markdown: string | undefined) {
  const [parsedHtml, setParsedHtml] = useState<string>('');

  useEffect(() => {
    if (!markdown) {
      setParsedHtml('');
      return;
    }

    try {
      // Configure marked with options supported by the current version
      marked.setOptions({
        breaks: true,     // Convert \n to <br> in paragraphs
        gfm: true,        // GitHub Flavored Markdown
        pedantic: false
      });
      
      const parseMarkdown = async () => {
        try {
          console.log("Parsing markdown:", markdown.substring(0, 100) + "...");
          // Parse markdown to HTML
          const html = await marked.parse(markdown);
          console.log("Parsed HTML result:", html.substring(0, 100) + "...");
          
          // Make all links open in a new tab with security attributes
          const safeHtml = html.replace(
            /<a href="([^"]+)"/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer"'
          );
          
          // Make images responsive 
          const responsiveHtml = safeHtml.replace(
            /<img src="([^"]+)"([^>]*)>/g,
            '<img src="$1" class="max-w-full h-auto rounded-md my-4" loading="lazy" $2>'
          );
          
          // Ensure tables are styled properly
          const styledHtml = responsiveHtml.replace(
            /<table>/g,
            '<table class="w-full border-collapse my-4">'
          ).replace(
            /<th>/g,
            '<th class="border border-gray-300 dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-800">'
          ).replace(
            /<td>/g,
            '<td class="border border-gray-300 dark:border-gray-700 p-2">'
          );
          
          setParsedHtml(styledHtml);
        } catch (error) {
          console.error('Error parsing markdown with marked:', error);
          // Use fallback parser if marked fails
          useFallbackParser(markdown, setParsedHtml);
        }
      };
      
      parseMarkdown();
    } catch (error) {
      console.error('Error in markdown parsing process:', error);
      useFallbackParser(markdown, setParsedHtml);
    }
  }, [markdown]);

  return parsedHtml;
}

// Fallback parser with improved list and image handling
function useFallbackParser(markdown: string, setParsedHtml: (html: string) => void) {
  // Convert markdown to HTML with basic rules
  let html = markdown
    // Handle headings
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    // Handle basic formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Handle images
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-4" loading="lazy">')
    // Handle links, open in new tab
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Handle paragraphs 
    .replace(/\n\n+/g, '</p><p>')
    // Handle bullet lists
    .replace(/^[*-] (.*?)$/gm, '<ul><li>$1</li></ul>')
    // Handle numbered lists
    .replace(/^(\d+)\.\s+(.*?)$/gm, '<ol><li>$2</li></ol>');
  
  // Fix consecutive list elements
  html = html
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/<\/ol>\s*<ol>/g, '');
  
  // Wrap in paragraph tags if not already
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }
  
  console.log("Fallback parser result:", html.substring(0, 100) + "...");
  setParsedHtml(html);
}
