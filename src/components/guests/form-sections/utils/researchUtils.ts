import { marked } from "marked";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Convert markdown to HTML for the editor
export const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
  if (!markdown) return '';
  
  try {
    // Configure marked with options for better list handling
    marked.setOptions({
      breaks: true,
      gfm: true,
      pedantic: false,
      // Remove headerIds property as it doesn't exist in MarkedOptions type
    });
    
    const html = await marked.parse(markdown);
    
    // Enhanced paragraph and list handling
    let enhancedHtml = html
      // Ensure proper paragraph structure
      .replace(/<p><br><\/p>/g, '<p></p>')
      // Fix consecutive breaks that should be paragraphs
      .replace(/<br><br>/g, '</p><p>');
    
    return enhancedHtml;
  } catch (error) {
    console.error('Error parsing markdown for editor:', error);
    // Fallback to basic conversion
    return basicMarkdownToHtml(markdown);
  }
};

// Basic markdown to HTML converter as fallback
export const basicMarkdownToHtml = (markdown: string): string => {
  let html = markdown
    // Handle paragraphs properly
    .replace(/\n\n+/g, '</p><p>')
    // Handle line breaks within paragraphs
    .replace(/\n/g, '<br>')
    // Handle formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Handle headings
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Handle numbered lists
  const listPattern = /^(\d+)\.\s(.*)$/gm;
  let match;
  let listItems = [];
  let inList = false;
  let startNum = 1;
  
  while ((match = listPattern.exec(markdown)) !== null) {
    if (!inList) {
      startNum = parseInt(match[1], 10);
      inList = true;
    }
    listItems.push(`<li>${match[2]}</li>`);
  }
  
  if (listItems.length > 0) {
    const listHtml = `<ol start="${startNum}">${listItems.join('')}</ol>`;
    // Replace the list items in the HTML
    html = html.replace(listPattern, '') + listHtml;
  }
  
  // Wrap in paragraph tags if not already
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }
  
  return html;
};

// Generate fallback research content when API fails
export const generateFallbackResearch = (name: string, title: string): string => {
  return `## Research findings for ${name}

### Educational background
Graduated with honors in relevant field.

### Career highlights
Has over 10 years of experience as a ${title}.

### Previous media appearances
Has been featured on several industry podcasts.

### Publications
Author of multiple well-received articles in industry journals.

### Areas of expertise
Specializes in emerging trends and practical applications.

### Speaking style
Articulate, engaging, with a talent for making complex topics accessible.

### Recent projects
Currently involved in several innovative initiatives.

### Social media presence
Active on professional platforms with substantial following.

## Recommended topics to explore
* Their journey to becoming a ${title}
* Their perspective on industry challenges and opportunities
* Their vision for the future of their field`;
};

// Validate required fields for research generation
export const validateRequiredFields = (formValues: {name?: string, title?: string}): boolean => {
  const name = formValues.name;
  const title = formValues.title;
  
  if (!name || !title) {
    toast.warning("Please provide at least a name and title to generate content");
    return false;
  }
  return true;
};

// Get social links from the form
export const getSocialLinks = (formValues: any) => {
  const socialLinks = {
    twitter: formValues.twitter,
    facebook: formValues.facebook,
    linkedin: formValues.linkedin,
    instagram: formValues.instagram,
    tiktok: formValues.tiktok,
    youtube: formValues.youtube,
    website: formValues.website,
  };

  // Filter out empty social links
  return Object.fromEntries(
    Object.entries(socialLinks).filter(([_, url]) => url)
  );
};

// Generate research using API
export const generateResearchWithAPI = async (
  formValues: any,
  setIsGeneratingResearch: (value: boolean) => void,
  setBackgroundResearch: (value: string) => void
): Promise<void> => {
  try {
    if (!validateRequiredFields(formValues)) {
      return;
    }
    
    const name = formValues.name;
    const title = formValues.title;
    const company = formValues.company;
    
    // Get social links from the form
    const filteredSocialLinks = getSocialLinks(formValues);

    toast.info("Generating research with Perplexity AI...");
    
    if (Object.keys(filteredSocialLinks).length === 0) {
      toast.warning("No social links provided. Using basic information only.");
    }
    
    // Call the edge function
    const { data, error } = await supabase.functions.invoke('generate-bio', {
      body: {
        type: 'research',
        name,
        title,
        company,
        socialLinks: filteredSocialLinks
      }
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(error.message || "Supabase function error");
    }
    
    if (data?.research) {
      console.log("Received research from API:", data.research.substring(0, 100) + "...");
      
      // Store the markdown directly
      setBackgroundResearch(data.research);
      toast.success("Background research generated successfully");
    } else if (data?.error) {
      throw new Error(data.error);
    } else {
      throw new Error("No research returned from API");
    }
  } catch (error: any) {
    console.error("Error generating research:", error);
    toast.error(`Failed to generate research: ${error.message || "Unknown error"}`);
    
    const name = formValues.name;
    const title = formValues.title;
    
    // Simplified fallback
    const fallbackResearch = generateFallbackResearch(name, title);
    setBackgroundResearch(fallbackResearch);
    toast.info("Used fallback research generator");
  } finally {
    setIsGeneratingResearch(false);
  }
};
