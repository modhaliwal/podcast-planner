
import { SocialLinks } from "@/lib/types";
import { Twitter, Linkedin, Globe, Instagram, Youtube } from "lucide-react";

interface GuestSocialLinksProps {
  socialLinks: SocialLinks;
}

export function GuestSocialLinks({ socialLinks }: GuestSocialLinksProps) {
  if (!socialLinks) return null;
  
  const hasSocials = Object.values(socialLinks).some(Boolean);
  if (!hasSocials) return null;
  
  return (
    <div className="flex items-center flex-wrap shrink-0 gap-1">
      {socialLinks.twitter && (
        <SocialLink 
          href={socialLinks.twitter}
          icon={<Twitter className="h-4 w-4" />}
          label="Twitter"
        />
      )}
      
      {socialLinks.linkedin && (
        <SocialLink 
          href={socialLinks.linkedin}
          icon={<Linkedin className="h-4 w-4" />}
          label="LinkedIn"
        />
      )}
      
      {socialLinks.instagram && (
        <SocialLink 
          href={socialLinks.instagram}
          icon={<Instagram className="h-4 w-4" />}
          label="Instagram"
        />
      )}
      
      {socialLinks.youtube && (
        <SocialLink 
          href={socialLinks.youtube}
          icon={<Youtube className="h-4 w-4" />}
          label="YouTube"
        />
      )}
      
      {socialLinks.website && (
        <SocialLink 
          href={socialLinks.website}
          icon={<Globe className="h-4 w-4" />}
          label="Website"
        />
      )}
    </div>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
      onClick={(e) => e.stopPropagation()}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  );
}
