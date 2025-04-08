
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Instagram, Globe, Youtube, Plus, X } from "lucide-react";

// Platform definitions with icons for consistent use
export const SOCIAL_PLATFORMS = [
  { id: 'twitter', label: 'X (Twitter)', icon: 
    <svg className="w-4 h-4 mr-2 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  },
  { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4 mr-2 text-muted-foreground" /> },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4 mr-2 text-muted-foreground" /> },
  { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4 mr-2 text-muted-foreground" /> },
  { id: 'tiktok', label: 'TikTok', icon: 
    <svg className="w-4 h-4 mr-2 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 10v7.65c0 .2-.08.4-.22.54-.14.16-.33.22-.54.22-.42 0-.76-.34-.76-.76V10H6c-.55 0-1-.45-1-1s.45-1 1-1h7.68c.3 0 .59-.13.8-.34.19-.2.31-.46.31-.73 0-.76-.36-1.47-.97-1.92.03 0 .06-.01.09-.01.74 0 1.39.49 1.6 1.2.26.92 1.23 1.55 2.2 1.36.56-.1.98-.55 1.09-1.11.06-.29.09-.59.09-.88 0-.44-.09-.85-.26-1.23-.32-.74-1.05-1.26-1.9-1.33-.2-.02-.39-.03-.59-.03-1.94 0-3.77.91-4.94 2.42-.43.55-1.21.72-1.84.43-.14-.06-.24-.19-.28-.34-.04-.14-.04-.29.02-.43C10.57 2.35 13.23 1 16.11 1c.33 0 .66.02.98.05 0 0 1.27.14 2.35.83.16.1.32.22.47.34 0 0 1.43 1.19 1.96 2.72.13.37.21.76.25 1.16.04.47.04.92-.02 1.36-.18 1.36-1.23 2.45-2.58 2.72-.47.09-.95.08-1.41-.01V16.5c0 1.82-.82 3.5-2.24 4.63-1.18.94-2.66 1.32-4.12 1.1-2.38-.37-4.24-2.36-4.47-4.76-.09-.94.08-1.88.5-2.73.35-.7.88-1.33 1.55-1.83.08-.06.22-.17.22-.17V10z" />
    </svg>
  },
  { id: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4 mr-2 text-muted-foreground" /> },
  { id: 'website', label: 'Website', icon: <Globe className="w-4 h-4 mr-2 text-muted-foreground" /> },
  { id: 'custom', label: 'Custom', icon: <Globe className="w-4 h-4 mr-2 text-muted-foreground" /> }
];

export interface LinkFormData {
  platform: string;
  url: string;
  label?: string;
}

interface LinkFormProps {
  onSubmit: (linkData: LinkFormData) => void;
  onCancel?: () => void;
  initialValues?: LinkFormData;
  excludedPlatforms?: string[];
  submitLabel?: string;
  className?: string;
}

export function LinkForm({
  onSubmit,
  onCancel,
  initialValues,
  excludedPlatforms = [],
  submitLabel = "Add",
  className = ""
}: LinkFormProps) {
  const [platform, setPlatform] = useState(initialValues?.platform || "");
  const [url, setUrl] = useState(initialValues?.url || "");
  const [label, setLabel] = useState(initialValues?.label || "");
  const [showCustomField, setShowCustomField] = useState(initialValues?.platform === 'custom');
  
  // Reset form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setPlatform(initialValues.platform);
      setUrl(initialValues.url);
      setLabel(initialValues.label || "");
      setShowCustomField(initialValues.platform === 'custom');
    }
  }, [initialValues]);
  
  // Filter platforms to exclude ones already in use
  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    p => !excludedPlatforms.includes(p.id) || (initialValues && p.id === initialValues.platform)
  );
  
  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    setShowCustomField(value === 'custom');
  };
  
  const handleSubmit = () => {
    if (!platform || !url.trim()) return;
    
    onSubmit({
      platform,
      url: url.trim(),
      label: label.trim() || undefined
    });
    
    // Reset form if not in edit mode
    if (!initialValues) {
      setPlatform("");
      setUrl("");
      setLabel("");
      setShowCustomField(false);
    }
  };
  
  const handleReset = () => {
    if (onCancel) {
      onCancel();
    } else {
      setPlatform("");
      setUrl("");
      setLabel("");
      setShowCustomField(false);
    }
  };
  
  return (
    <div className={`space-y-3 ${className}`}>
      <Select value={platform} onValueChange={handlePlatformChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          {availablePlatforms.map(platform => (
            <SelectItem key={platform.id} value={platform.id}>
              <div className="flex items-center">
                {platform.icon}
                <span>{platform.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL"
      />
      
      {(showCustomField || label) && (
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Custom label (optional)"
        />
      )}
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleSubmit}
          disabled={!platform || !url.trim()}
        >
          {submitLabel}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
