
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Guest } from '@/lib/types';
import { marked } from 'marked';
import { useEffect, useState } from 'react';

interface GuestAboutSectionProps {
  guest: Guest;
}

export function GuestAboutSection({ guest }: GuestAboutSectionProps) {
  const [parsedResearch, setParsedResearch] = useState<string>('');
  
  useEffect(() => {
    if (guest.backgroundResearch) {
      try {
        // Use marked with valid configuration options
        marked.setOptions({
          breaks: true,  // Convert line breaks to <br>
          gfm: true,     // GitHub flavored markdown
          pedantic: false
        });
        
        // Parse the markdown
        const htmlContent = marked.parse(guest.backgroundResearch);
        
        if (typeof htmlContent === 'string') {
          console.log('Successfully parsed markdown to HTML');
          setParsedResearch(htmlContent);
        } else {
          console.error('Marked returned unexpected type:', typeof htmlContent);
          // Fallback handling if marked returns a Promise
          const fallbackHtml = guest.backgroundResearch
            .replace(/\n\n/g, '</p><p>') // Convert double line breaks to paragraph breaks
            .replace(/\n/g, '<br>') // Convert single line breaks to <br>
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/^### (.*?)$/gm, '<h3>$1</h3>') // h3 headings
            .replace(/^## (.*?)$/gm, '<h2>$1</h2>') // h2 headings
            .replace(/^# (.*?)$/gm, '<h1>$1</h1>'); // h1 headings
          
          setParsedResearch(`<p>${fallbackHtml}</p>`);
        }
      } catch (error) {
        console.error('Error parsing markdown:', error);
        
        // More sophisticated fallback that handles the most common markdown
        const fallbackHtml = guest.backgroundResearch
          .replace(/\n\n/g, '</p><p>') // Convert double line breaks to paragraph breaks
          .replace(/\n/g, '<br>') // Convert single line breaks to <br>
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
          .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
          .replace(/^### (.*?)$/gm, '<h3>$1</h3>') // h3 headings
          .replace(/^## (.*?)$/gm, '<h2>$1</h2>') // h2 headings
          .replace(/^# (.*?)$/gm, '<h1>$1</h1>'); // h1 headings
        
        setParsedResearch(`<p>${fallbackHtml}</p>`);
      }
    } else {
      setParsedResearch('');
    }
  }, [guest.backgroundResearch]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{guest.bio}</p>
          </div>
        </CardContent>
      </Card>
      
      {guest.backgroundResearch && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Background Research</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose dark:prose-invert max-w-none 
                prose-h1:text-xl prose-h1:font-bold prose-h1:mb-3 prose-h1:mt-4
                prose-h2:text-lg prose-h2:font-semibold prose-h2:mb-2 prose-h2:mt-4
                prose-h3:text-base prose-h3:font-medium prose-h3:mb-2 prose-h3:mt-3
                prose-p:my-2 prose-p:leading-relaxed
                prose-ul:my-3 prose-ul:pl-5 prose-ul:list-disc
                prose-ol:my-3 prose-ol:pl-5 prose-ol:list-decimal
                prose-li:my-1
                prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
                prose-strong:font-semibold prose-em:italic"
              dangerouslySetInnerHTML={{ __html: parsedResearch }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
