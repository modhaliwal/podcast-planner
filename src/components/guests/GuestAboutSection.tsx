
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Guest } from '@/lib/types';
import { useMarkdownParser } from '@/hooks/useMarkdownParser';

interface GuestAboutSectionProps {
  guest: Guest;
}

export function GuestAboutSection({ guest }: GuestAboutSectionProps) {
  const parsedResearch = useMarkdownParser(guest.backgroundResearch);

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
                prose-headings:font-semibold
                prose-h1:text-xl prose-h1:font-bold
                prose-h2:text-lg prose-h2:font-semibold
                prose-h3:text-base prose-h3:font-semibold
                prose-p:my-2 prose-p:leading-relaxed
                prose-ul:my-2 prose-ul:pl-5 prose-ul:list-disc
                prose-ol:my-2 prose-ol:pl-5 prose-ol:list-decimal
                prose-li:my-1 prose-li:pl-1
                prose-a:text-blue-600 hover:prose-a:text-blue-800
                prose-strong:font-semibold prose-em:italic"
              dangerouslySetInnerHTML={{ __html: parsedResearch }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
