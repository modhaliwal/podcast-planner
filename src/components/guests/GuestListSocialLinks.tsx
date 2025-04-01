
import { SocialLinks } from "@/lib/types";
import { SocialIconsBar } from "@/components/shared/SocialIconsBar";

interface GuestSocialLinksProps {
  socialLinks: SocialLinks;
}

export function GuestSocialLinks({ socialLinks }: GuestSocialLinksProps) {
  if (!socialLinks) return null;
  
  const hasSocials = Object.values(socialLinks).some(Boolean);
  if (!hasSocials) return null;
  
  return (
    <SocialIconsBar 
      socialLinks={socialLinks} 
      size="md" 
      variant="default" 
    />
  );
}
