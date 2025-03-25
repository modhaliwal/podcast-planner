
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
        // Configure marked with simpler options for better compatibility
        marked.setOptions({
          breaks: true,
          gfm: true,
        });
        
        // Parse the markdown to HTML
        const parsedHtml = marked.parse(guest.backgroundResearch);
        
        // Ensure we're getting a string (not a Promise)
        if (typeof parsedHtml === 'string') {
          setParsedResearch(parsedHtml);
          console.log('Parsed HTML excerpt:', parsedHtml.slice(0, 100) + '...');
        } else {
          // Handle the case where marked returns a Promise
          console.error('Marked returned a Promise instead of a string');
          // Parse the raw markdown as plain text with simple line break conversion
          setParsedResearch(guest.backgroundResearch.replace(/\n/g, '<br />'));
        }
      } catch (error) {
        console.error('Error parsing markdown:', error);
        // Fallback to raw content with line breaks if parsing fails
        setParsedResearch(guest.backgroundResearch.replace(/\n/g, '<br />'));
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
