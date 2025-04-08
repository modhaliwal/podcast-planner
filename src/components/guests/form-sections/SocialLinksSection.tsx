
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Facebook, Linkedin, Instagram, Globe, Youtube, Plus, X, ChevronDown, ChevronUp, ListPlus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialLinkCategory } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

interface SocialLinksSectionProps {
  form: UseFormReturn<any>;
}

// Social media platforms with their icons
const platforms = [
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

export function SocialLinksSection({ form }: SocialLinksSectionProps) {
  const [newPlatform, setNewPlatform] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [showCustomField, setShowCustomField] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [categoryPlatform, setCategoryPlatform] = useState("");
  const [categoryUrl, setCategoryUrl] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);

  // Get the form values
  const formValues = form.getValues();
  
  // Define existing links by checking which ones have values
  const existingLinks = platforms
    .filter(platform => platform.id !== 'custom' && formValues[platform.id])
    .map(platform => platform.id);

  // Filter available platforms (exclude ones already added)
  const availablePlatforms = platforms.filter(
    platform => !existingLinks.includes(platform.id) || platform.id === 'custom'
  );

  // Get existing categories or initialize empty array
  const categories = formValues.categories || [];

  // Handle adding a new social link
  const handleAddLink = () => {
    if (newPlatform === 'custom') {
      if (customLabel.trim()) {
        // For custom platforms, we'd store them in a different way
        setCustomLabel("");
        setShowCustomField(false);
      }
    } else if (newPlatform) {
      // Focus on the newly added field
      setTimeout(() => {
        const input = document.getElementById(`social-${newPlatform}`);
        if (input) input.focus();
      }, 0);
    }
    
    setNewPlatform("");
  };

  // Handle removing a social link
  const handleRemoveLink = (platform: string) => {
    form.setValue(platform, "", { shouldValidate: true });
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: SocialLinkCategory = {
      id: uuidv4(),
      name: newCategoryName,
      links: []
    };
    
    const updatedCategories = [...categories, newCategory];
    form.setValue('categories', updatedCategories);
    
    setNewCategoryName("");
    setShowCategoryInput(false);
  };

  // Handle removing a category
  const handleRemoveCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(
      (category: SocialLinkCategory) => category.id !== categoryId
    );
    form.setValue('categories', updatedCategories);
  };

  // Handle adding a link to a category
  const handleAddLinkToCategory = (categoryId: string) => {
    if (!categoryPlatform || !categoryUrl.trim()) return;
    
    const updatedCategories = categories.map((category: SocialLinkCategory) => {
      if (category.id === categoryId) {
        return {
          ...category,
          links: [
            ...category.links,
            {
              platform: categoryPlatform,
              url: categoryUrl,
              label: customLabel.trim() || undefined
            }
          ]
        };
      }
      return category;
    });
    
    form.setValue('categories', updatedCategories);
    
    // Reset form
    setCategoryPlatform("");
    setCategoryUrl("");
    setCustomLabel("");
    setEditingCategoryId(null);
    setEditingLinkIndex(null);
  };

  // Handle removing a link from a category
  const handleRemoveLinkFromCategory = (categoryId: string, linkIndex: number) => {
    const updatedCategories = categories.map((category: SocialLinkCategory) => {
      if (category.id === categoryId) {
        const updatedLinks = [...category.links];
        updatedLinks.splice(linkIndex, 1);
        return {
          ...category,
          links: updatedLinks
        };
      }
      return category;
    });
    
    form.setValue('categories', updatedCategories);
  };

  // Handle editing a link in a category
  const handleEditLinkInCategory = (categoryId: string, linkIndex: number) => {
    const category = categories.find((c: SocialLinkCategory) => c.id === categoryId);
    if (!category) return;
    
    const link = category.links[linkIndex];
    setCategoryPlatform(link.platform);
    setCategoryUrl(link.url);
    setCustomLabel(link.label || "");
    setEditingCategoryId(categoryId);
    setEditingLinkIndex(linkIndex);
  };

  // Update an existing link
  const handleUpdateLink = () => {
    if (!editingCategoryId || editingLinkIndex === null) return;
    
    const updatedCategories = categories.map((category: SocialLinkCategory) => {
      if (category.id === editingCategoryId) {
        const updatedLinks = [...category.links];
        updatedLinks[editingLinkIndex] = {
          platform: categoryPlatform,
          url: categoryUrl,
          label: customLabel.trim() || undefined
        };
        return {
          ...category,
          links: updatedLinks
        };
      }
      return category;
    });
    
    form.setValue('categories', updatedCategories);
    
    // Reset form
    setCategoryPlatform("");
    setCategoryUrl("");
    setCustomLabel("");
    setEditingCategoryId(null);
    setEditingLinkIndex(null);
  };

  const renderPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.icon : <Globe className="w-4 h-4 mr-2 text-muted-foreground" />;
  };

  const getPlatformLabel = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.label : platformId;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Social Links</h3>
      
      {/* Display existing links */}
      {existingLinks.map(platformId => (
        <FormField
          key={platformId}
          control={form.control}
          name={platformId}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {renderPlatformIcon(platformId)}
                  <FormLabel>{platforms.find(p => p.id === platformId)?.label}</FormLabel>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveLink(platformId)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
              <FormControl>
                <Input 
                  {...field} 
                  id={`social-${platformId}`}
                  placeholder={`https://${platformId}.com/username`} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      
      {/* Add new platform selector */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Add a social link</h4>
        
        <div className="flex gap-2">
          <Select value={newPlatform} onValueChange={(value) => {
            setNewPlatform(value);
            setShowCustomField(value === 'custom');
          }}>
            <SelectTrigger className="flex-1">
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
          
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={handleAddLink}
            disabled={!newPlatform || (newPlatform === 'custom' && !customLabel.trim())}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add</span>
          </Button>
        </div>
        
        {/* Show custom field if custom platform is selected */}
        {showCustomField && (
          <Input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Enter custom platform name"
            className="mt-2"
          />
        )}
      </div>
      
      {/* Categories Section */}
      <div className="space-y-4 mt-6 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Link Categories</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCategoryInput(true)}
            className="h-8"
          >
            <ListPlus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
        
        {/* New Category Input */}
        {showCategoryInput && (
          <div className="flex gap-2 items-center">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="default" 
              size="sm"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="h-10"
            >
              Add
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setShowCategoryInput(false);
                setNewCategoryName("");
              }}
              className="h-10"
            >
              Cancel
            </Button>
          </div>
        )}
        
        {/* Display Categories */}
        {categories.length > 0 && (
          <Accordion type="multiple" className="w-full">
            {categories.map((category: SocialLinkCategory) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-sm font-medium">{category.name}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pb-2">
                    {/* List of links in this category */}
                    {category.links.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/40 rounded">
                        <div className="flex items-center flex-1 overflow-hidden">
                          {renderPlatformIcon(link.platform)}
                          <div className="ml-2 overflow-hidden">
                            <div className="font-medium text-sm truncate">
                              {link.label || getPlatformLabel(link.platform)}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {link.url}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLinkInCategory(category.id, index)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveLinkFromCategory(category.id, index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add link to category form */}
                    <Card className="p-3">
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium">
                          {editingLinkIndex !== null ? "Edit Link" : "Add Link to Category"}
                        </h4>
                        <Select value={categoryPlatform} onValueChange={setCategoryPlatform}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {platforms.map(platform => (
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
                          value={categoryUrl}
                          onChange={(e) => setCategoryUrl(e.target.value)}
                          placeholder="URL"
                        />
                        
                        <Input
                          value={customLabel}
                          onChange={(e) => setCustomLabel(e.target.value)}
                          placeholder="Custom label (optional)"
                        />
                        
                        <div className="flex justify-end space-x-2">
                          {editingLinkIndex !== null ? (
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={handleUpdateLink}
                              disabled={!categoryPlatform || !categoryUrl.trim()}
                            >
                              Update
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={() => handleAddLinkToCategory(category.id)}
                              disabled={!categoryPlatform || !categoryUrl.trim()}
                            >
                              Add
                            </Button>
                          )}
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCategoryPlatform("");
                              setCategoryUrl("");
                              setCustomLabel("");
                              setEditingCategoryId(null);
                              setEditingLinkIndex(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                    
                    <div className="flex justify-between mt-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Category
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
