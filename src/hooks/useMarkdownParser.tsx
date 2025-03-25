
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
        headerIds: false // Changed from headerIds: true to fix TypeScript error
      });
      
      const parseMarkdown = async () => {
        try {
          // Parse markdown to HTML
          const html = await marked.parse(markdown);
          
          // Improve paragraph formatting (convert single <br> to proper paragraphs)
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
  // Fix consecutive <br> tags that should be paragraphs
  let improved = html
    .replace(/<br><br>/g, '</p><p>')
    .replace(/<p><br>/g, '<p>');
  
  // Ensure ordered lists are preserved correctly
  improved = improved
    .replace(/<p>(\d+)\.\s(.*?)<\/p>/g, '<ol start="$1"><li>$2</li></ol>')
    // Fix consecutive list items
    .replace(/<\/ol>\s*<ol start="\d+">/g, '');
  
  // Ensure content is wrapped in paragraphs if it's not in a block element
  if (!improved.startsWith('<p>') && 
      !improved.startsWith('<h') && 
      !improved.startsWith('<ul') && 
      !improved.startsWith('<ol')) {
    improved = `<p>${improved}</p>`;
  }
  
  // Ensure the HTML doesn't end with an unclosed paragraph
  if (improved.lastIndexOf('<p>') > improved.lastIndexOf('</p>')) {
    improved += '</p>';
  }
  
  return improved;
}

// Extracted fallback parser with improved list handling
function useFallbackParser(markdown: string, setParsedHtml: (html: string) => void) {
  let fallbackHtml = markdown
    // Handle paragraphs properly
    .replace(/\n\n+/g, '</p><p>')
    // Handle line breaks within paragraphs
    .replace(/\n/g, '<br>')
    // Handle formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Handle headings
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Handle numbered lists properly
  const listRegex = /^(\d+)\.\s(.*)$/gm;
  let match;
  let listItems = [];
  let lastIndex = 0;
  let startNumber = 1;
  let inList = false;
  
  while ((match = listRegex.exec(markdown)) !== null) {
    if (!inList) {
      startNumber = parseInt(match[1], 10);
      inList = true;
      listItems.push(`<li>${match[2]}</li>`);
    } else {
      listItems.push(`<li>${match[2]}</li>`);
    }
    lastIndex = match.index + match[0].length;
  }
  
  if (listItems.length > 0) {
    fallbackHtml = fallbackHtml.replace(listRegex, '');
    const olHtml = `<ol start="${startNumber}">${listItems.join('')}</ol>`;
    fallbackHtml += olHtml;
  }
  
  // Wrap in paragraph tags if not already wrapped
  if (!fallbackHtml.startsWith('<')) {
    fallbackHtml = `<p>${fallbackHtml}</p>`;
  }
  
  setParsedHtml(fallbackHtml);
}
