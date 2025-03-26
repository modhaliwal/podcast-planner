
// Markdown to HTML converter for Supabase Edge Functions
import { remark } from 'https://esm.sh/remark@15.0.1';
import remarkHtml from 'https://esm.sh/remark-html@16.0.1';
import remarkGfm from 'https://esm.sh/remark-gfm@4.0.0';

/**
 * Converts markdown content to HTML
 * @param markdown The markdown content to convert
 * @returns HTML string
 */
export async function convertMarkdownToHtml(markdown: string): Promise<string> {
  if (!markdown) {
    throw new Error("No markdown content provided for conversion");
  }
  
  try {
    console.log("Converting markdown to HTML...");
    
    // Process the markdown to HTML using remark
    const file = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown support
      .use(remarkHtml, {
        sanitize: true // Sanitize HTML output for security
      })
      .process(markdown);
    
    // Convert the processed content to string
    let html = String(file);
    
    // Enhance HTML with responsive styling
    html = enhanceHtml(html);
    
    console.log("Markdown conversion successful");
    return html;
  } catch (error) {
    console.error("Error converting markdown to HTML:", error);
    throw new Error(`Failed to convert markdown to HTML: ${error.message}`);
  }
}

/**
 * Enhances HTML with responsive styling and additional features
 */
function enhanceHtml(html: string): string {
  // Make all links open in a new tab with security attributes
  let enhanced = html.replace(
    /<a href="([^"]+)"/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );
  
  // Make images responsive with proper styling
  enhanced = enhanced.replace(
    /<img src="([^"]+)"([^>]*)>/g,
    '<img src="$1" class="max-w-full h-auto rounded-md my-4" loading="lazy" alt="Research image" $2>'
  );
  
  // Ensure tables are styled properly
  enhanced = enhanced.replace(
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
  enhanced = enhanced.replace(
    /<ul>/g,
    '<ul class="pl-5 list-disc my-4">'
  ).replace(
    /<ol>/g,
    '<ol class="pl-5 list-decimal my-4">'
  ).replace(
    /<li>/g,
    '<li class="mb-1">'
  );
  
  // Format headings
  enhanced = enhanced.replace(
    /<h2>/g,
    '<h2 class="text-xl font-semibold mt-5 mb-2">'
  ).replace(
    /<h3>/g,
    '<h3 class="text-lg font-semibold mt-4 mb-2">'
  );
  
  // Format references with superscript styling
  enhanced = enhanced.replace(
    /\[(\d+)\]/g, 
    '<sup class="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-1 rounded ml-0.5">[⁠$1]</sup>'
  );
  
  return enhanced;
}
