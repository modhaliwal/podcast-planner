
import { SocialLinks } from "@/lib/types";
import { SocialIconsBar } from "@/components/shared/SocialIconsBar";

interface GuestSocialLinksProps {
  socialLinks: SocialLinks;
}

export function GuestSocialLinks({ socialLinks }: GuestSocialLinksProps) {
  const hasSocialLinks = Object.values(socialLinks).some(Boolean);
  
  if (!hasSocialLinks) return null;
  
  return (
    <SocialIconsBar 
      socialLinks={socialLinks} 
      align="center" 
      variant="profile" 
      className="mb-6"
    />
  );
}
