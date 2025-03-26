
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
        gfm: true,        // GitHub Flavored Markdown (includes tables)
        pedantic: false
      });
      
      const parseMarkdown = async () => {
        try {
          console.log("Parsing markdown:", markdown.substring(0, 100) + "...");
          // Parse markdown to HTML
          const html = await marked.parse(markdown);
          console.log("Parsed HTML result length:", html.length);
          
          // Make all links open in a new tab with security attributes
          const safeHtml = html.replace(
            /<a href="([^"]+)"/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer"'
          );
          
          // Make images responsive with proper styling
          const responsiveHtml = safeHtml.replace(
            /<img src="([^"]+)"([^>]*)>/g,
            '<img src="$1" class="max-w-full h-auto rounded-md my-4" loading="lazy" alt="Research image" $2>'
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
          
          // Enhance lists
          const enhancedListsHtml = styledHtml.replace(
            /<ul>/g,
            '<ul class="pl-5 list-disc my-4">'
          ).replace(
            /<ol>/g,
            '<ol class="pl-5 list-decimal my-4">'
          ).replace(
            /<li>/g,
            '<li class="mb-1">'
          );
          
          // Format references with superscript styling
          const enhancedHtml = enhancedListsHtml.replace(
            /\[(\d+)\]/g, 
            '<sup class="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-1 rounded ml-0.5">[⁠$1]</sup>'
          );
          
          setParsedHtml(enhancedHtml);
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
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-semibold mt-5 mb-2">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
    // Handle basic formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Handle images with responsive styling
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-4" loading="lazy">')
    // Handle links, open in new tab
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Handle references with superscript
    .replace(/\[(\d+)\]/g, '<sup class="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-1 rounded ml-0.5">[⁠$1]</sup>')
    // Handle paragraphs 
    .replace(/\n\n+/g, '</p><p>')
    // Handle bullet lists - improved to capture multi-line items
    .replace(/^[*-] ([\s\S]*?)(?=^[*-]|^$|^\S)/gm, '<ul class="pl-5 list-disc my-4"><li class="mb-1">$1</li></ul>')
    // Handle numbered lists - improved to capture multi-line items
    .replace(/^(\d+)\.\s+([\s\S]*?)(?=^\d+\.|^$|^\S)/gm, '<ol class="pl-5 list-decimal my-4"><li class="mb-1">$2</li></ol>');
  
  // Fix consecutive list elements
  html = html
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/<\/ol>\s*<ol>/g, '');
  
  // Basic table handling
  // Look for | separated content that looks like tables
  const tableLines = markdown.match(/^\|(.+)\|$/gm);
  if (tableLines && tableLines.length > 2) {
    let tableHtml = '<table class="w-full border-collapse my-4">\n<thead>\n<tr>';
    
    // Process header row
    const headerCells = tableLines[0].split('|').filter(cell => cell.trim());
    headerCells.forEach(cell => {
      tableHtml += `<th class="border border-gray-300 dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-800">${cell.trim()}</th>`;
    });
    
    tableHtml += '</tr>\n</thead>\n<tbody>';
    
    // Skip separator row (index 1) and process data rows
    for (let i = 2; i < tableLines.length; i++) {
      tableHtml += '<tr>';
      const cells = tableLines[i].split('|').filter(cell => cell.trim());
      cells.forEach(cell => {
        tableHtml += `<td class="border border-gray-300 dark:border-gray-700 p-2">${cell.trim()}</td>`;
      });
      tableHtml += '</tr>\n';
    }
    
    tableHtml += '</tbody>\n</table>';
    
    // Find the table section in the original markdown and replace it with our tableHtml
    const tableSection = tableLines.join('\n');
    html = html.replace(tableSection, tableHtml);
  }
  
  // Wrap in paragraph tags if not already
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }
  
  console.log("Fallback parser result length:", html.length);
  setParsedHtml(html);
}
