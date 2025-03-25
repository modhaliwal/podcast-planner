
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
      
      // Parse markdown to HTML
      const html = marked.parse(markdown);
      setParsedHtml(html);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      
      // Fallback basic parsing
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
  }, [markdown]);

  return parsedHtml;
}
