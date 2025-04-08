
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { X, ChevronDown, ChevronUp, ListPlus, Pencil, Trash2, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialLinkCategory } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { LinkForm, SOCIAL_PLATFORMS, LinkFormData } from "./social/LinkForm";

interface SocialLinksSectionProps {
  form: UseFormReturn<any>;
}

export function SocialLinksSection({ form }: SocialLinksSectionProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [editingMainLinkPlatform, setEditingMainLinkPlatform] = useState<string | null>(null);

  // Get the form values
  const formValues = form.getValues();
  
  // Define existing links by checking which ones have values
  const existingLinks = SOCIAL_PLATFORMS
    .filter(platform => platform.id !== 'custom' && formValues[platform.id])
    .map(platform => platform.id);

  // Get existing categories or initialize empty array
  const categories = formValues.categories || [];

  // Handle adding a new social link
  const handleAddLink = (linkData: LinkFormData) => {
    form.setValue(linkData.platform, linkData.url, { shouldValidate: true });
    
    // Focus on the newly added field
    setTimeout(() => {
      const input = document.getElementById(`social-${linkData.platform}`);
      if (input) input.focus();
    }, 0);
  };

  // Handle removing a social link
  const handleRemoveLink = (platform: string) => {
    form.setValue(platform, "", { shouldValidate: true });
  };

  // Handle editing a main profile link
  const handleEditMainLink = (platform: string) => {
    setEditingMainLinkPlatform(platform);
  };

  // Handle updating a main profile link
  const handleUpdateMainLink = (linkData: LinkFormData) => {
    form.setValue(linkData.platform, linkData.url, { shouldValidate: true });
    setEditingMainLinkPlatform(null);
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
  const handleAddLinkToCategory = (categoryId: string, linkData: LinkFormData) => {
    const updatedCategories = categories.map((category: SocialLinkCategory) => {
      if (category.id === categoryId) {
        return {
          ...category,
          links: [
            ...category.links,
            {
              platform: linkData.platform,
              url: linkData.url,
              label: linkData.label
            }
          ]
        };
      }
      return category;
    });
    
    form.setValue('categories', updatedCategories);
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
    setEditingCategoryId(categoryId);
    setEditingLinkIndex(linkIndex);
  };

  // Update an existing link
  const handleUpdateLinkInCategory = (categoryId: string, linkIndex: number, linkData: LinkFormData) => {
    const updatedCategories = categories.map((category: SocialLinkCategory) => {
      if (category.id === categoryId) {
        const updatedLinks = [...category.links];
        updatedLinks[linkIndex] = {
          platform: linkData.platform,
          url: linkData.url,
          label: linkData.label
        };
        return {
          ...category,
          links: updatedLinks
        };
      }
      return category;
    });
    
    form.setValue('categories', updatedCategories);
    
    // Reset editing state
    setEditingCategoryId(null);
    setEditingLinkIndex(null);
  };

  const renderPlatformIcon = (platformId: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    return platform ? platform.icon : <X className="w-4 h-4 mr-2 text-muted-foreground" />;
  };

  const getPlatformLabel = (platformId: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    return platform ? platform.label : platformId;
  };

  // Function to handle opening the link in a new tab
  const handleLinkClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent edit/form interaction
    e.preventDefault(); // Prevent default behavior
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Social Links</h3>
      
      {/* Display existing links in the improved visual format */}
      <div className="space-y-3">
        {existingLinks.map(platformId => (
          <div key={platformId} className="flex items-center justify-between p-2 bg-muted/40 rounded">
            <div className="flex items-center flex-1 overflow-hidden">
              {renderPlatformIcon(platformId)}
              <div className="ml-2 overflow-hidden">
                <a 
                  href={formValues[platformId]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(formValues[platformId], e)}
                  className="font-medium text-sm truncate hover:underline cursor-pointer group"
                >
                  {getPlatformLabel(platformId)} 
                  <ExternalLink className="h-3 w-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <div 
                  className="text-xs text-muted-foreground truncate hover:underline cursor-pointer"
                  onClick={(e) => handleLinkClick(formValues[platformId], e)}
                >
                  {formValues[platformId]}
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleEditMainLink(platformId)}
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveLink(platformId)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Edit Main Link Form */}
      {editingMainLinkPlatform && (
        <Card className="p-3 mt-2">
          <h4 className="text-xs font-medium mb-3">Edit Link</h4>
          <LinkForm
            initialValues={{
              platform: editingMainLinkPlatform,
              url: formValues[editingMainLinkPlatform] || ""
            }}
            onSubmit={handleUpdateMainLink}
            onCancel={() => setEditingMainLinkPlatform(null)}
            submitLabel="Update"
          />
        </Card>
      )}
      
      {/* Add new platform selector - with improved compact UI */}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Add a social link</h4>
        <LinkForm 
          onSubmit={handleAddLink}
          excludedPlatforms={existingLinks}
          compact={true}
        />
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
                            <a 
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => handleLinkClick(link.url, e)}
                              className="font-medium text-sm truncate hover:underline cursor-pointer group"
                            >
                              {link.label || getPlatformLabel(link.platform)}
                              <ExternalLink className="h-3 w-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <div 
                              className="text-xs text-muted-foreground truncate hover:underline cursor-pointer"
                              onClick={(e) => handleLinkClick(link.url, e)}
                            >
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
                    
                    {/* Add link to category form - with improved compact UI */}
                    <LinkForm
                      onSubmit={(linkData) => handleAddLinkToCategory(category.id, linkData)}
                      compact={true}
                      className={
                        editingCategoryId === category.id && editingLinkIndex !== null ? 
                        "hidden" : ""
                      }
                    />
                    
                    {/* Edit link in category form */}
                    {editingCategoryId === category.id && editingLinkIndex !== null && (
                      <Card className="p-3">
                        <h4 className="text-xs font-medium mb-3">Edit Link</h4>
                        <LinkForm
                          initialValues={category.links[editingLinkIndex]}
                          onSubmit={(linkData) => handleUpdateLinkInCategory(category.id, editingLinkIndex, linkData)}
                          onCancel={() => {
                            setEditingCategoryId(null);
                            setEditingLinkIndex(null);
                          }}
                          submitLabel="Update"
                        />
                      </Card>
                    )}
                    
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
