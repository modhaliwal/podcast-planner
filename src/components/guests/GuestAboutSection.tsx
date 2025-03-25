
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Guest } from '@/lib/types';
import { marked } from 'marked';
import { useEffect, useState } from 'react';

interface GuestAboutSectionProps {
  guest: Guest;
}

export function GuestAboutSection({ guest }: GuestAboutSectionProps) {
  const [parsedResearch, setParsedResearch] = useState<string>('');

  // Parse the markdown when the component loads or when the research changes
  useEffect(() => {
    if (guest.backgroundResearch) {
      try {
        // Configure marked with valid options
        marked.setOptions({
          breaks: true,      // Convert line breaks to <br>
          gfm: true,         // Enable GitHub flavored markdown
        });
        
        // Parse the markdown to HTML
        const parsedHtml = marked.parse(guest.backgroundResearch, { async: false }) as string;
        console.log('Parsed HTML:', parsedHtml.slice(0, 200) + '...'); // Debug log
        
        setParsedResearch(parsedHtml);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        // Fallback to raw content if parsing fails
        setParsedResearch(`<p>${guest.backgroundResearch}</p>`);
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
                prose-headings:mt-4 prose-headings:mb-2 prose-headings:font-medium
                prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                prose-p:my-3 prose-p:leading-relaxed
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-5
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-5
                prose-li:my-1 prose-li:pl-1
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
