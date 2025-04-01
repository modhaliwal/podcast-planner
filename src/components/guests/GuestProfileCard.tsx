
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Guest } from '@/lib/types';
import { SocialIconsBar } from '@/components/shared/SocialIconsBar';
import { GuestContactInfo } from './GuestContactInfo';
import { useState, useEffect } from 'react';
import { isBlobUrl } from '@/lib/imageUpload';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
  
  // Handle image download
  const handleDownload = () => {
    if (validImageUrl) {
      // Create an anchor element
      const link = document.createElement('a');
      link.href = validImageUrl;
      
      // Extract filename from URL or use guest name with extension
      const filename = validImageUrl.split('/').pop() || 
        `${guest.name.replace(/\s+/g, '_')}_headshot.jpg`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
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
          <p className="text-muted-foreground mb-1">{guest.title}</p>
          {guest.company && (
            <p className="text-sm text-muted-foreground mb-4">{guest.company}</p>
          )}
          
          <SocialIconsBar 
            socialLinks={guest.socialLinks} 
            align="center" 
            variant="profile" 
            className="mb-6"
          />
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
