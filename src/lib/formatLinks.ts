
import { SocialLinks, SocialLinkCategory } from "@/lib/types";

export function formatAllLinks(socialLinks: SocialLinks): string {
  const formattedLinks: string[] = [];
  
  // Format standard social media links
  const standardLinks = {
    twitter: 'X (Twitter)',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    website: 'Website'
  };

  Object.entries(standardLinks).forEach(([key, label]) => {
    if (socialLinks[key as keyof SocialLinks]) {
      formattedLinks.push(`${label}: ${socialLinks[key as keyof SocialLinks]}`);
    }
  });

  // Format category-based links
  if (socialLinks.categories?.length) {
    socialLinks.categories.forEach((category: SocialLinkCategory) => {
      if (category.links.length) {
        formattedLinks.push(`\n${category.name}:`);
        category.links.forEach(link => {
          formattedLinks.push(`- ${link.label || link.platform}: ${link.url}`);
        });
      }
    });
  }

  // Format other links if they exist
  if (socialLinks.other?.length) {
    formattedLinks.push('\nOther Links:');
    socialLinks.other.forEach(link => {
      formattedLinks.push(`- ${link.label}: ${link.url}`);
    });
  }

  return formattedLinks.join('\n');
}
