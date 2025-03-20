
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Guest } from '@/lib/types';
import { GuestSocialLinks } from './GuestSocialLinks';
import { GuestContactInfo } from './GuestContactInfo';

interface GuestProfileCardProps {
  guest: Guest;
}

export function GuestProfileCard({ guest }: GuestProfileCardProps) {
  // Get initials from name
  const initials = guest.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  return (
    <Card className="sticky top-28 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {guest.imageUrl ? (
            <div className="w-full max-w-[200px] mb-4 overflow-hidden rounded-md border">
              <AspectRatio ratio={2/3} className="bg-muted">
                <img 
                  src={guest.imageUrl} 
                  alt={`${guest.name} headshot`}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          ) : (
            <Avatar className="h-24 w-24 border mb-4">
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
          )}
          
          <h2 className="text-xl font-semibold">{guest.name}</h2>
          <p className="text-muted-foreground mb-1">{guest.title}</p>
          {guest.company && (
            <p className="text-sm text-muted-foreground mb-4">{guest.company}</p>
          )}
          
          <GuestSocialLinks socialLinks={guest.socialLinks} />
          <GuestContactInfo email={guest.email} phone={guest.phone} />
        </div>
        
        {guest.notes && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium text-lg mb-2">Personal Notes</h3>
            <div 
              className="prose prose-ul:list-disc prose-ol:list-decimal prose-li:ml-6 prose-p:my-2 dark:prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: guest.notes }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
