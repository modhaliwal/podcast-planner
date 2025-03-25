
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
      // Configure marked with simple options
      marked.setOptions({
        breaks: true,
        gfm: true,
        pedantic: false
      });
      
      // Handle the parsing, which could be synchronous or asynchronous
      const result = marked.parse(markdown);
      
      // If result is a promise, handle it properly
      if (result instanceof Promise) {
        result.then(html => {
          setParsedHtml(html);
        }).catch(error => {
          console.error('Error parsing markdown asynchronously:', error);
          useFallbackParser(markdown, setParsedHtml);
        });
      } else {
        // If it's a regular string, set it directly
        setParsedHtml(result);
      }
    } catch (error) {
      console.error('Error parsing markdown:', error);
      useFallbackParser(markdown, setParsedHtml);
    }
  }, [markdown]);

  return parsedHtml;
}

// Extracted fallback parser as a separate function for cleaner code
function useFallbackParser(markdown: string, setParsedHtml: (html: string) => void) {
  const fallbackHtml = markdown
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  setParsedHtml(`<p>${fallbackHtml}</p>`);
}
