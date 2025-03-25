
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Guest } from '@/lib/types';
import { useMarkdownParser } from '@/hooks/useMarkdownParser';

interface GuestAboutSectionProps {
  guest: Guest;
}

export function GuestAboutSection({ guest }: GuestAboutSectionProps) {
  const parsedBio = useMarkdownParser(guest.bio);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {parsedBio ? (
              <div dangerouslySetInnerHTML={{ __html: parsedBio }} />
            ) : (
              <p className="whitespace-pre-line">{guest.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
