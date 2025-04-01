
import { SocialLinks } from "@/lib/types";
import { Twitter, Linkedin, Globe, Instagram, Youtube, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export interface SocialIconsBarProps {
  socialLinks: SocialLinks;
  align?: "start" | "center" | "end";
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "profile";
  className?: string;
}

export function SocialIconsBar({ 
  socialLinks, 
  align = "start", 
  showLabels = false,
  size = "md",
  variant = "default",
  className 
}: SocialIconsBarProps) {
  if (!socialLinks) return null;
  
  const hasSocials = Object.values(socialLinks).some(Boolean);
  if (!hasSocials) return null;
  
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
      <div className={cn(
        "flex flex-wrap items-center", 
        containerSizes[size],
        alignmentClasses[align],
        className
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
