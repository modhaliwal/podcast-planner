
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
      // Configure marked with improved options for better HTML rendering
      marked.setOptions({
        breaks: true, // Convert \n to <br> in paragraphs
        gfm: true,    // GitHub Flavored Markdown
        pedantic: false,
        // Remove headerIds property as it doesn't exist in MarkedOptions type
      });
      
      const parseMarkdown = async () => {
        try {
          // Parse markdown to HTML
          const html = await marked.parse(markdown);
          
          // Improve HTML formatting
          const improvedHtml = improveHtmlFormatting(html);
          
          setParsedHtml(improvedHtml);
        } catch (error) {
          console.error('Error parsing markdown:', error);
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

// Helper function to improve HTML formatting
function improveHtmlFormatting(html: string): string {
  // Fix ordered lists - ensure proper ol/li structure
  let improved = html;
  
  // Check for numbered list items that aren't properly wrapped in <ol>
  const numberedListPattern = /<p>(\d+)\.\s+(.*?)<\/p>/g;
  if (numberedListPattern.test(html)) {
    // First, collect all list items
    const listItems: {num: string, content: string}[] = [];
    let match;
    const regex = new RegExp(numberedListPattern);
    
    // Find all list items
    while ((match = regex.exec(html)) !== null) {
      listItems.push({
        num: match[1],
        content: match[2]
      });
    }
    
    if (listItems.length > 0) {
      // Replace the pattern with proper <ol><li> structure
      let listHtml = `<ol>`;
      listItems.forEach(item => {
        listHtml += `<li>${item.content}</li>`;
      });
      listHtml += `</ol>`;
      
      // Replace the list items in the HTML
      improved = html.replace(numberedListPattern, '');
      improved += listHtml;
    }
  }
  
  // Ensure proper paragraph wrapping
  if (!improved.startsWith('<')) {
    improved = `<p>${improved}</p>`;
  }
  
  // Replace single <br> tags with proper paragraph breaks
  improved = improved
    .replace(/<br><br>/g, '</p><p>')
    .replace(/<p><br>/g, '<p>')
    .replace(/<br><\/p>/g, '</p>');
  
  // Fix bullet points
  improved = improved
    .replace(/<p>•\s+(.*?)<\/p>/g, '<ul><li>$1</li></ul>')
    .replace(/<\/ul>\s*<ul>/g, '');
  
  return improved;
}

// Fallback parser with improved list handling
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
  
  setParsedHtml(html);
}
