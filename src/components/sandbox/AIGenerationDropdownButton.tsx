
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, Check, Trash2, Type, AlignLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Editor } from '@/components/editor/Editor';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';

// Types for the dropdown options
export type DropdownOption = {
  id: string;
  label: string;
  description?: string;
  version?: string;
  date?: string;
  source?: 'Manual Input' | 'AI Generated' | 'Imported';
};

// Types for the content versions
export interface ContentVersion {
  id: string;
  content: string;
  timestamp: string;
  source: 'manual' | 'ai' | 'imported';
  active: boolean;
  versionNumber: number;
}

// Props for the AI Generation Dropdown Button
export interface AIGenerationDropdownButtonProps {
  buttonLabel?: string;
  loadingLabel?: string;
  isGenerating?: boolean;
  disabled?: boolean;
  options: DropdownOption[];
  onButtonClick: () => void;
  onOptionSelect: (option: DropdownOption) => void;
  onClearAllVersions?: () => void;
  className?: string;
  showNotification?: boolean;
  selectedOptionId?: string;
  // New configuration props for hover card
  hoverCardConfig?: {
    aiProvider?: string;
    promptKey?: string;
    promptTitle?: string;
    edgeFunctionName?: string;
  };
  // Props for rich text editor
  editorContent?: string;
  onEditorChange?: (content: string) => void;
  showEditor?: boolean;
  editorPlaceholder?: string;
  // New prop for configuring initial editor height
  editorMinHeight?: number;
  // New prop for content name
  contentName?: string;
  // New prop for editor type (rich text or plain text)
  editorType?: 'rich' | 'plain';
  // New prop for content versions
  editorContentVersions?: ContentVersion[];
  onContentVersionsChange?: (versions: ContentVersion[]) => void;
}

/**
 * A specialized button for AI content generation with a dropdown menu.
 * Clicking the main button triggers the primary action, while the dropdown
 * icon shows a menu of alternative options.
 * 
 * IMPORTANT: This component deliberately maintains all functionality in a single file
 * despite its length. The component's behavior relies on tightly coupled state management
 * and coordinated interactions between the button, dropdown menu, and hover card.
 * 
 * DO NOT REFACTOR this component into smaller pieces as it would:
 * 1. Break the encapsulated state management
 * 2. Complicate the API interface
 * 3. Make maintenance more difficult
 * 4. Potentially introduce bugs in the coordinated behavior
 */
export function AIGenerationDropdownButton({
  buttonLabel = "Generate",
  loadingLabel = "Generating...",
  isGenerating = false,
  disabled = false,
  options,
  onButtonClick,
  onOptionSelect,
  onClearAllVersions,
  className,
  showNotification = true,
  selectedOptionId,
  hoverCardConfig,
  editorContent = "",
  onEditorChange,
  showEditor = true,
  editorPlaceholder = "Enter your content here...",
  editorMinHeight = 200,
  contentName,
  editorType = 'rich',
  editorContentVersions = [],
  onContentVersionsChange,
}: AIGenerationDropdownButtonProps) {
  // State to manage the dropdown open state
  const [open, setOpen] = useState(false);
  // State to track if user has clicked "Clear all versions" once
  const [clearConfirmationState, setClearConfirmationState] = useState(false);
  // Internal state for the editor content if no external handler is provided
  const [internalEditorContent, setInternalEditorContent] = useState(editorContent);
  // State to track editor type (rich text or plain text)
  const [currentEditorType, setCurrentEditorType] = useState<'rich' | 'plain'>(editorType);
  // Internal state for content versions if no external handler is provided
  const [internalContentVersions, setInternalContentVersions] = useState<ContentVersion[]>(editorContentVersions);

  // Update internal state when external props change
  useEffect(() => {
    if (editorContentVersions.length > 0) {
      setInternalContentVersions(editorContentVersions);
    }
  }, [editorContentVersions]);

  // Handler for the clear all versions option
  const handleClearAllVersions = () => {
    if (clearConfirmationState) {
      // User confirmed, trigger the clear action
      if (onClearAllVersions) {
        onClearAllVersions();
      }
      // Also clear internal versions if we're managing them
      if (!onContentVersionsChange) {
        setInternalContentVersions([]);
      }
      setClearConfirmationState(false);
      setOpen(false);
    } else {
      // First click, show confirmation
      setClearConfirmationState(true);
    }
  };

  // Reset confirmation state when dropdown closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setClearConfirmationState(false);
    }
  };

  // Handle editor content changes
  const handleEditorChange = (content: string) => {
    if (onEditorChange) {
      onEditorChange(content);
    } else {
      setInternalEditorContent(content);
    }
  };

  // Handle editor type change
  const handleEditorTypeChange = (value: string) => {
    if (value) {
      setCurrentEditorType(value as 'rich' | 'plain');
    }
  };

  // Select a specific version
  const handleSelectVersion = (version: ContentVersion) => {
    // Set the content from the selected version
    const newContent = version.content;
    handleEditorChange(newContent);
    
    // Update the active state in versions
    const updatedVersions = (onContentVersionsChange ? editorContentVersions : internalContentVersions).map(v => ({
      ...v,
      active: v.id === version.id
    }));
    
    if (onContentVersionsChange) {
      onContentVersionsChange(updatedVersions);
    } else {
      setInternalContentVersions(updatedVersions);
    }
    
    // Close the dropdown
    setOpen(false);
  };

  // Add a new version
  const addVersion = (content: string, source: 'manual' | 'ai' | 'imported' = 'manual') => {
    const currentVersions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    
    // Find highest version number to increment
    const highestVersion = currentVersions.reduce(
      (max, v) => (v.versionNumber > max ? v.versionNumber : max), 
      0
    );
    
    // Create new version
    const newVersion: ContentVersion = {
      id: `version-${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      source,
      active: true,
      versionNumber: highestVersion + 1
    };
    
    // Set all other versions as inactive
    const updatedVersions = currentVersions.map(v => ({
      ...v,
      active: false
    }));
    
    // Add the new version to the array
    const newVersions = [...updatedVersions, newVersion];
    
    if (onContentVersionsChange) {
      onContentVersionsChange(newVersions);
    } else {
      setInternalContentVersions(newVersions);
    }
    
    return newVersion;
  };

  // Map content versions to dropdown options for display
  const getContentVersionOptions = (): DropdownOption[] => {
    const versions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    
    return versions.map(version => ({
      id: version.id,
      label: `Version ${version.versionNumber}`,
      version: `v${version.versionNumber}`,
      date: new Date(version.timestamp).toLocaleString(),
      source: version.source === 'manual' 
        ? 'Manual Input' 
        : version.source === 'ai' 
          ? 'AI Generated' 
          : 'Imported'
    }));
  };

  // Get the ID of the active version
  const getActiveVersionId = (): string | undefined => {
    const versions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    const activeVersion = versions.find(v => v.active);
    return activeVersion?.id;
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Modified layout: Content name on left, editor type toggle and button on right */}
      {showEditor && (
        <div className="flex justify-between items-center mb-2">
          {contentName && <h3 className="font-medium text-base">{contentName}</h3>}
          <div className="flex items-center gap-2">
            {/* Editor type toggle */}
            <ToggleGroup 
              type="single" 
              value={currentEditorType} 
              onValueChange={handleEditorTypeChange}
              className="border rounded-md"
            >
              <ToggleGroupItem value="rich" aria-label="Rich Text Editor" title="Rich Text Editor">
                <Type className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="plain" aria-label="Plain Text Editor" title="Plain Text Editor">
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <div className="flex">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // When generating content, potentially add a new version
                      const currentContent = onEditorChange ? editorContent : internalEditorContent;
                      if (currentContent.trim()) {
                        addVersion(currentContent);
                      }
                      onButtonClick();
                    }}
                    disabled={disabled || isGenerating}
                    className="flex items-center gap-1 rounded-r-none border-r-0"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isGenerating ? loadingLabel : buttonLabel}
                  </Button>
                </HoverCardTrigger>
                {hoverCardConfig && (
                  <HoverCardContent className="w-auto min-w-[280px] p-4" side="top">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">AI Generation Configuration</h4>
                      
                      {hoverCardConfig.promptKey && (
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-muted-foreground">Prompt Key:</span>
                          <span className="col-span-2 font-medium break-words">{hoverCardConfig.promptKey}</span>
                        </div>
                      )}
                      
                      {hoverCardConfig.promptTitle && (
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-muted-foreground">Prompt Title:</span>
                          <span className="col-span-2 font-medium break-words">{hoverCardConfig.promptTitle}</span>
                        </div>
                      )}
                      
                      {hoverCardConfig.aiProvider && (
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-muted-foreground">AI Provider:</span>
                          <span className="col-span-2 font-medium break-words">{hoverCardConfig.aiProvider}</span>
                        </div>
                      )}
                      
                      {hoverCardConfig.edgeFunctionName && (
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-muted-foreground">Edge Function:</span>
                          <span className="col-span-2 font-medium break-words">{hoverCardConfig.edgeFunctionName}</span>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                )}
              </HoverCard>
              
              <DropdownMenu open={open} onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled || isGenerating}
                    className="px-2 rounded-l-none relative"
                  >
                    <ChevronDown className="h-4 w-4" />
                    {showNotification && (
                      <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        {getContentVersionOptions().length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-auto min-w-[280px]">
                  <div className="flex flex-col h-72">
                    {/* Scrollable area for content versions */}
                    <ScrollArea className="flex-grow">
                      <div className="pr-4 py-1">
                        {getContentVersionOptions().map(option => (
                          <DropdownMenuItem
                            key={option.id}
                            onClick={() => {
                              const version = (onContentVersionsChange ? editorContentVersions : internalContentVersions)
                                .find(v => v.id === option.id);
                              if (version) {
                                handleSelectVersion(version);
                              }
                            }}
                            className="py-2"
                          >
                            <div className="flex items-center justify-between w-full gap-2">
                              {getActiveVersionId() === option.id && (
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mr-1" />
                              )}
                              {option.version && (
                                <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">
                                  {option.version}
                                </span>
                              )}
                              {option.date && (
                                <span className="font-medium text-sm">
                                  {option.date}
                                </span>
                              )}
                              {option.source && (
                                <span className="text-xs text-muted-foreground italic ml-auto">
                                  {option.source}
                                </span>
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    {/* Fixed footer with clear option */}
                    {getContentVersionOptions().length > 0 && (
                      <div className="border-t mt-auto sticky bottom-0 bg-popover">
                        <DropdownMenuItem
                          onClick={handleClearAllVersions}
                          className="py-2 text-destructive hover:bg-destructive/10"
                          onSelect={(e) => {
                            // Prevent the default behavior of closing the dropdown
                            e.preventDefault();
                          }}
                        >
                          <div className="flex items-center w-full gap-2">
                            <Trash2 className="h-4 w-4 flex-shrink-0" />
                            {clearConfirmationState 
                              ? <span className="font-medium">Yes, I am sure!</span>
                              : <span>Clear all versions</span>
                            }
                          </div>
                        </DropdownMenuItem>
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {/* Move the button above if showEditor is false */}
      {!showEditor && (
        <div className="flex">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onButtonClick}
                disabled={disabled || isGenerating}
                className="flex items-center gap-1 rounded-r-none border-r-0"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? loadingLabel : buttonLabel}
              </Button>
            </HoverCardTrigger>
            {hoverCardConfig && (
              <HoverCardContent className="w-auto min-w-[280px] p-4" side="top">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">AI Generation Configuration</h4>
                  
                  {hoverCardConfig.promptKey && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Prompt Key:</span>
                      <span className="col-span-2 font-medium break-words">{hoverCardConfig.promptKey}</span>
                    </div>
                  )}
                  
                  {hoverCardConfig.promptTitle && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Prompt Title:</span>
                      <span className="col-span-2 font-medium break-words">{hoverCardConfig.promptTitle}</span>
                    </div>
                  )}
                  
                  {hoverCardConfig.aiProvider && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">AI Provider:</span>
                      <span className="col-span-2 font-medium break-words">{hoverCardConfig.aiProvider}</span>
                    </div>
                  )}
                  
                  {hoverCardConfig.edgeFunctionName && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Edge Function:</span>
                      <span className="col-span-2 font-medium break-words">{hoverCardConfig.edgeFunctionName}</span>
                    </div>
                  )}
                </div>
              </HoverCardContent>
            )}
          </HoverCard>
          
          <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled || isGenerating}
                className="px-2 rounded-l-none relative"
              >
                <ChevronDown className="h-4 w-4" />
                {showNotification && getContentVersionOptions().length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {getContentVersionOptions().length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto min-w-[280px]">
              <div className="flex flex-col h-72">
                {/* Scrollable area for options */}
                <ScrollArea className="flex-grow">
                  <div className="pr-4 py-1">
                    {getContentVersionOptions().map(option => (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => {
                          const version = (onContentVersionsChange ? editorContentVersions : internalContentVersions)
                            .find(v => v.id === option.id);
                          if (version) {
                            handleSelectVersion(version);
                          }
                        }}
                        className="py-2"
                      >
                        <div className="flex items-center justify-between w-full gap-2">
                          {getActiveVersionId() === option.id && (
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mr-1" />
                          )}
                          {option.version && (
                            <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">
                              {option.version}
                            </span>
                          )}
                          {option.date && (
                            <span className="font-medium text-sm">
                              {option.date}
                            </span>
                          )}
                          {option.source && (
                            <span className="text-xs text-muted-foreground italic ml-auto">
                              {option.source}
                            </span>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Fixed footer with clear option */}
                {getContentVersionOptions().length > 0 && (
                  <div className="border-t mt-auto sticky bottom-0 bg-popover">
                    <DropdownMenuItem
                      onClick={handleClearAllVersions}
                      className="py-2 text-destructive hover:bg-destructive/10"
                      onSelect={(e) => {
                        // Prevent the default behavior of closing the dropdown
                        e.preventDefault();
                      }}
                    >
                      <div className="flex items-center w-full gap-2">
                        <Trash2 className="h-4 w-4 flex-shrink-0" />
                        {clearConfirmationState 
                          ? <span className="font-medium">Yes, I am sure!</span>
                          : <span>Clear all versions</span>
                        }
                      </div>
                    </DropdownMenuItem>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Editor Section - Either Rich Text or Plain Text */}
      {showEditor && (
        <div>
          {currentEditorType === 'rich' ? (
            // Rich Text Editor with simple preview 
            <div className="border rounded-md">
              <div className="min-h-[300px]">
                <Editor
                  value={onEditorChange ? editorContent : internalEditorContent}
                  onChange={handleEditorChange}
                  placeholder={editorPlaceholder}
                />
              </div>
              <div className="p-4 bg-muted/30 border-t">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: onEditorChange ? editorContent : internalEditorContent 
                  }}
                />
              </div>
            </div>
          ) : (
            // Plain Text Editor
            <Textarea
              value={onEditorChange ? editorContent : internalEditorContent}
              onChange={(e) => handleEditorChange(e.target.value)}
              placeholder={editorPlaceholder}
              className="min-h-[300px] w-full resize-none"
            />
          )}
        </div>
      )}
    </div>
  );
}
