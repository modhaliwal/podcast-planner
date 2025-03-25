
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Guest } from '@/lib/types';

interface GuestAboutSectionProps {
  guest: Guest;
}

export function GuestAboutSection({ guest }: GuestAboutSectionProps) {
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
                prose-strong:font-semibold prose-em:italic"
              dangerouslySetInnerHTML={{ __html: guest.backgroundResearch }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
