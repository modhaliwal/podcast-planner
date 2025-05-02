
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Guest } from '@/lib/types';
import { SocialIconsBar } from '@/components/shared/SocialIconsBar';
import { useState, useEffect } from 'react';
import { isBlobUrl } from '@/lib/imageUpload';
import { Download, Mail, Phone } from 'lucide-react';

interface GuestProfileCardProps {
  guest: Guest;
}

export function GuestProfileCard({ guest }: GuestProfileCardProps) {
  const [imageError, setImageError] = useState(false);
  const [validImageUrl, setValidImageUrl] = useState<string | undefined>(undefined);
  
  // Get initials from name
  const initials = guest.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  // Validate image URL when it changes
  useEffect(() => {
    // If the URL is a blob URL, it won't be valid after a page refresh
    if (guest.imageUrl && !isBlobUrl(guest.imageUrl)) {
      setValidImageUrl(guest.imageUrl);
      setImageError(false);
    } else {
      setValidImageUrl(undefined);
    }
  }, [guest.imageUrl]);
  
  // Determine if we should show image or avatar
  const showAvatar = !validImageUrl || imageError;
  
  return (
    <Card className="sticky top-28 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {!showAvatar ? (
            <div className="w-full max-w-[200px] mb-4 overflow-hidden rounded-md border relative">
              <AspectRatio ratio={2/3} className="bg-muted">
                <img 
                  src={validImageUrl} 
                  alt={`${guest.name} headshot`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    console.error("Image failed to load:", validImageUrl);
                    setImageError(true);
                  }}
                />
              </AspectRatio>
              
              {/* Download link - matching style from EpisodeDetail component */}
              <div className="p-2 bg-muted/50 border-t border-border flex justify-center">
                <a 
                  href={validImageUrl} 
                  download={`headshot-${guest.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-3 w-3" />
                  Download original
                </a>
              </div>
            </div>
          ) : (
            <Avatar className="h-24 w-24 border mb-4">
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
          )}
          
          <h2 className="text-xl font-semibold">{guest.name}</h2>
          <p className="text-muted-foreground mb-4">{guest.title}</p>
          
          <SocialIconsBar 
            socialLinks={guest.socialLinks} 
            size="sm"
            variant="default" 
            className="mb-4"
          />
          
          {/* Contact information after social icons */}
          {(guest.email || guest.phone) && (
            <div className="mt-2 w-full text-center">
              {guest.email && (
                <div className="flex items-center justify-center space-x-2 text-sm mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${guest.email}`} className="hover:underline">{guest.email}</a>
                </div>
              )}
              
              {guest.phone && (
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${guest.phone}`} className="hover:underline">{guest.phone}</a>
                </div>
              )}
            </div>
          )}
        </div>
        
        {guest.notes && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium text-lg mb-2">Personal Notes</h3>
            <div 
              className="rich-text rich-text-sm"
              dangerouslySetInnerHTML={{ __html: guest.notes }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
