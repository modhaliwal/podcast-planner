
/**
 * Simple markdown to HTML converter for Deno environment
 */
export async function convertMarkdownToHtml(markdown: string): Promise<string> {
  try {
    // Simple regex replacements for basic markdown
    let html = markdown;
    
    // Headers
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Lists
    html = html.replace(/^\s*\*\s*(.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\s*-\s*(.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    
    // Paragraphs
    html = html.replace(/\n(?!\n|<h|<ul|<li)/g, '<br>');
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><ul>/g, '<ul>');
    html = html.replace(/<\/ul><\/p>/g, '</ul>');
    
    return html;
  } catch (error) {
    console.error("Error converting markdown to HTML:", error);
    return `<p>${markdown}</p>`;
  }
}
