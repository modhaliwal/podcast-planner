
import { Twitter, Linkedin, Instagram, Youtube, Globe } from 'lucide-react';
import { SocialLinks } from '@/lib/types';

interface GuestSocialLinksProps {
  socialLinks: SocialLinks;
}

export function GuestSocialLinks({ socialLinks }: GuestSocialLinksProps) {
  const hasSocialLinks = Object.values(socialLinks).some(Boolean);
  
  if (!hasSocialLinks) return null;
  
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {socialLinks.twitter && (
        <a 
          href={socialLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
          aria-label="Twitter"
        >
          <Twitter className="h-4 w-4" />
        </a>
      )}
      
      {socialLinks.linkedin && (
        <a 
          href={socialLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      )}
      
      {socialLinks.instagram && (
        <a 
          href={socialLinks.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="h-4 w-4" />
        </a>
      )}
      
      {socialLinks.youtube && (
        <a 
          href={socialLinks.youtube} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
          aria-label="YouTube"
        >
          <Youtube className="h-4 w-4" />
        </a>
      )}
      
      {socialLinks.website && (
        <a 
          href={socialLinks.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
          aria-label="Website"
        >
          <Globe className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
