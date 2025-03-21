
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
              className="prose prose-ul:list-disc prose-ol:list-decimal prose-li:ml-6 prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-h3:text-lg prose-h3:font-medium prose-strong:font-semibold dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: guest.backgroundResearch }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
