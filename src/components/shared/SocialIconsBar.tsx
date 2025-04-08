
import { SocialLinks, SocialLinkCategory } from "@/lib/types";
import { Twitter, Linkedin, Globe, Instagram, Youtube, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export interface SocialIconsBarProps {
  socialLinks: SocialLinks;
  align?: "start" | "center" | "end";
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "profile";
  className?: string;
  showCategories?: boolean;
}

export function SocialIconsBar({ 
  socialLinks, 
  align = "start", 
  showLabels = false,
  size = "md",
  variant = "default",
  className,
  showCategories = false
}: SocialIconsBarProps) {
  if (!socialLinks) return null;
  
  // Check if there are any main social links or categories with links
  const hasMainSocials = Object.entries(socialLinks)
    .filter(([key]) => key !== 'categories' && key !== 'other')
    .some(([_, value]) => !!value);
  
  const hasCategories = socialLinks.categories && 
    socialLinks.categories.some(category => category.links.length > 0);
  
  if (!hasMainSocials && !hasCategories) return null;
  
  // Set sizing based on the size prop
  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  const containerSizes = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2"
  };
  
  // Set button styling based on variant
  const buttonStyles = {
    default: "text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted",
    profile: "p-2 rounded-full bg-muted hover:bg-accent transition-colors"
  };
  
  // Alignment classes
  const alignmentClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end"
  };
  
  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        {/* Main social links */}
        <div className={cn(
          "flex flex-wrap items-center", 
          containerSizes[size],
          alignmentClasses[align]
        )}>
          {socialLinks.twitter && (
            <SocialIcon
              href={socialLinks.twitter}
              icon={<Twitter className={iconSizes[size]} />}
              label="X (Twitter)"
              buttonClassName={buttonStyles[variant]}
              showLabel={showLabels}
            />
          )}
          
          {socialLinks.linkedin && (
            <SocialIcon
              href={socialLinks.linkedin}
              icon={<Linkedin className={iconSizes[size]} />}
              label="LinkedIn"
              buttonClassName={buttonStyles[variant]}
              showLabel={showLabels}
            />
          )}
          
          {socialLinks.instagram && (
            <SocialIcon
              href={socialLinks.instagram}
              icon={<Instagram className={iconSizes[size]} />}
              label="Instagram"
              buttonClassName={buttonStyles[variant]}
              showLabel={showLabels}
            />
          )}
          
          {socialLinks.youtube && (
            <SocialIcon
              href={socialLinks.youtube}
              icon={<Youtube className={iconSizes[size]} />}
              label="YouTube"
              buttonClassName={buttonStyles[variant]}
              showLabel={showLabels}
            />
          )}
          
          {socialLinks.facebook && (
            <SocialIcon
              href={socialLinks.facebook}
              icon={<Facebook className={iconSizes[size]} />}
              label="Facebook"
              buttonClassName={buttonStyles[variant]}
              showLabel={showLabels}
            />
          )}
          
          {socialLinks.website && (
            <SocialIcon
              href={socialLinks.website}
              icon={<Globe className={iconSizes[size]} />}
              label="Website"
              buttonClassName={buttonStyles[variant]}
              showLabel={showLabels}
            />
          )}
        </div>
        
        {/* Categorized links */}
        {showCategories && hasCategories && (
          <div className="space-y-3">
            {socialLinks.categories?.map((category: SocialLinkCategory) => (
              category.links.length > 0 && (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      {category.name}
                    </Badge>
                  </div>
                  <div className={cn(
                    "flex flex-wrap items-center", 
                    containerSizes[size],
                    alignmentClasses[align]
                  )}>
                    {category.links.map((link, index) => (
                      <SocialIcon
                        key={`${category.id}-${index}`}
                        href={link.url}
                        icon={getPlatformIcon(link.platform, iconSizes[size])}
                        label={link.label || getPlatformLabel(link.platform)}
                        buttonClassName={buttonStyles[variant]}
                        showLabel={showLabels}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  buttonClassName?: string;
  showLabel?: boolean;
}

function SocialIcon({ href, icon, label, buttonClassName, showLabel }: SocialIconProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className={buttonClassName}
          onClick={(e) => e.stopPropagation()}
        >
          {icon}
          {showLabel && <span className="ml-2 text-xs">{label}</span>}
          {!showLabel && <span className="sr-only">{label}</span>}
        </a>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

// Helper function to get platform icon based on platform ID
function getPlatformIcon(platformId: string, sizeClass: string) {
  switch (platformId) {
    case 'twitter':
      return (
        <svg className={cn("mr-2 text-muted-foreground", sizeClass)} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'facebook':
      return <Facebook className={cn("mr-2 text-muted-foreground", sizeClass)} />;
    case 'linkedin':
      return <Linkedin className={cn("mr-2 text-muted-foreground", sizeClass)} />;
    case 'instagram':
      return <Instagram className={cn("mr-2 text-muted-foreground", sizeClass)} />;
    case 'youtube':
      return <Youtube className={cn("mr-2 text-muted-foreground", sizeClass)} />;
    case 'tiktok':
      return (
        <svg className={cn("mr-2 text-muted-foreground", sizeClass)} viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 10v7.65c0 .2-.08.4-.22.54-.14.16-.33.22-.54.22-.42 0-.76-.34-.76-.76V10H6c-.55 0-1-.45-1-1s.45-1 1-1h7.68c.3 0 .59-.13.8-.34.19-.2.31-.46.31-.73 0-.76-.36-1.47-.97-1.92.03 0 .06-.01.09-.01.74 0 1.39.49 1.6 1.2.26.92 1.23 1.55 2.2 1.36.56-.1.98-.55 1.09-1.11.06-.29.09-.59.09-.88 0-.44-.09-.85-.26-1.23-.32-.74-1.05-1.26-1.9-1.33-.2-.02-.39-.03-.59-.03-1.94 0-3.77.91-4.94 2.42-.43.55-1.21.72-1.84.43-.14-.06-.24-.19-.28-.34-.04-.14-.04-.29.02-.43C10.57 2.35 13.23 1 16.11 1c.33 0 .66.02.98.05 0 0 1.27.14 2.35.83.16.1.32.22.47.34 0 0 1.43 1.19 1.96 2.72.13.37.21.76.25 1.16.04.47.04.92-.02 1.36-.18 1.36-1.23 2.45-2.58 2.72-.47.09-.95.08-1.41-.01V16.5c0 1.82-.82 3.5-2.24 4.63-1.18.94-2.66 1.32-4.12 1.1-2.38-.37-4.24-2.36-4.47-4.76-.09-.94.08-1.88.5-2.73.35-.7.88-1.33 1.55-1.83.08-.06.22-.17.22-.17V10z" />
        </svg>
      );
    default:
      return <Globe className={cn("mr-2 text-muted-foreground", sizeClass)} />;
  }
}

// Helper function to get platform label based on platform ID
function getPlatformLabel(platformId: string) {
  switch (platformId) {
    case 'twitter':
      return 'X (Twitter)';
    case 'facebook':
      return 'Facebook';
    case 'linkedin':
      return 'LinkedIn';
    case 'instagram':
      return 'Instagram';
    case 'tiktok':
      return 'TikTok';
    case 'youtube':
      return 'YouTube';
    case 'website':
      return 'Website';
    default:
      return platformId.charAt(0).toUpperCase() + platformId.slice(1);
  }
}
