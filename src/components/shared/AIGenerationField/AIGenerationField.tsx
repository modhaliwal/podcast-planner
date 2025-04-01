// DO NOT REFACTOR THIS FILE – UNDER ANY CIRCUMSTANCES
// Moved from sandbox to shared components for better reusability

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, Check, Trash2 } from "lucide-react";
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
import { Textarea } from '@/components/ui/textarea';
import { ContentVersion as ContentVersionType } from '@/lib/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Making ContentVersion available for import by other components
export type ContentVersion = ContentVersionType;

export type DropdownOption = {
  id: string;
  label: string;
  description?: string;
  version?: string;
  date?: string;
  source?: string;
};

export interface AIGenerationFieldProps {
  buttonLabel?: string;
  loadingLabel?: string;
  isGenerating?: boolean;
  disabled?: boolean;
  options?: DropdownOption[];
  onButtonClick?: () => void;
  onOptionSelect?: (option: DropdownOption) => void;
  onClearAllVersions?: () => void;
  className?: string;
  showNotification?: boolean;
  selectedOptionId?: string;
  hoverCardConfig?: {
    aiProvider?: string;
    promptKey?: string;
    promptTitle?: string;
    edgeFunctionName?: string;
    generatorSlug?: string;
  };
  editorContent?: string;
  onEditorChange?: (content: string) => void;
  showEditor?: boolean;
  editorPlaceholder?: string;
  editorMinHeight?: number;
  contentName?: string;
  editorType?: 'rich' | 'plain';
  editorContentVersions?: ContentVersionType[];
  onContentVersionsChange?: (versions: ContentVersionType[]) => void;
  userIdentifier?: string;
  generatorSlug?: string;
  generationParameters?: Record<string, any>;
}

// Export the AIGenerationField component
export function AIGenerationField({
  buttonLabel = "Generate",
  loadingLabel = "Generating...",
  isGenerating: propIsGenerating = false,
  disabled = false,
  options = [],
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
  userIdentifier = 'user',
  generatorSlug,
  generationParameters,
}: AIGenerationFieldProps) {
  const [open, setOpen] = useState(false);
  const [clearConfirmationState, setClearConfirmationState] = useState(false);
  const [internalEditorContent, setInternalEditorContent] = useState(editorContent);
  const [internalContentVersions, setInternalContentVersions] = useState<ContentVersionType[]>(editorContentVersions);
  const [isGenerating, setIsGenerating] = useState(propIsGenerating);
  
  const hasInitialized = useRef(false);
  const contentEditedAfterInitialLoad = useRef(false);
  const contentEditedAfterAIGeneration = useRef(false);
  const lastAIGeneratedContent = useRef<string | null>(null);
  const isProcessingAIGeneration = useRef(false);

  useEffect(() => {
    if (editorContentVersions.length > 0) {
      setInternalContentVersions(editorContentVersions);
    }
  }, [editorContentVersions]);

  useEffect(() => {
    if (editorContent !== internalEditorContent) {
      setInternalEditorContent(editorContent);
    }
  }, [editorContent]);

  useEffect(() => {
    setIsGenerating(propIsGenerating);
  }, [propIsGenerating]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      const currentVersions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
      if (currentVersions.length === 0 && editorContent.trim()) {
        console.log("Initializing with first version");
        const initialVersion = createNewVersion(editorContent, userIdentifier);
        
        if (onContentVersionsChange) {
          onContentVersionsChange([initialVersion]);
        } else {
          setInternalContentVersions([initialVersion]);
        }
      }
      return;
    }

    if (isProcessingAIGeneration.current) {
      return;
    }

    const currentContent = onEditorChange ? editorContent : internalEditorContent;
    const previousContent = getActiveVersionContent();
    
    if (currentContent === previousContent) return;
    
    if (!contentEditedAfterInitialLoad.current && lastAIGeneratedContent.current === null) {
      contentEditedAfterInitialLoad.current = true;
      
      const newVersion = createNewVersion(currentContent, userIdentifier);
      addVersionToState(newVersion);
    }
    
    if (lastAIGeneratedContent.current !== null && 
        currentContent !== lastAIGeneratedContent.current && 
        !contentEditedAfterAIGeneration.current) {
      contentEditedAfterAIGeneration.current = true;
      
      const newVersion = createNewVersion(currentContent, userIdentifier);
      addVersionToState(newVersion);
    }
  }, [editorContent, internalEditorContent, editorContentVersions, internalContentVersions, onContentVersionsChange, userIdentifier]);

  const handleEditorBlur = () => {
    const currentVersions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    const currentContent = onEditorChange ? editorContent : internalEditorContent;
    
    const activeVersionIndex = currentVersions.findIndex(v => v.active);
    
    if (activeVersionIndex === -1) {
      console.warn("No active version found on blur");
      return;
    }
    
    if (currentVersions[activeVersionIndex].content === currentContent) {
      return;
    }
    
    const updatedVersions = [...currentVersions];
    updatedVersions[activeVersionIndex] = {
      ...updatedVersions[activeVersionIndex],
      content: currentContent,
    };
    
    if (onContentVersionsChange) {
      onContentVersionsChange(updatedVersions);
    } else {
      setInternalContentVersions(updatedVersions);
    }
    
    console.log("Updated active version content on blur");
  };

  const handleClearAllVersions = () => {
    if (clearConfirmationState) {
      const currentVersions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
      const activeVersion = currentVersions.find(v => v.active);
      
      if (!activeVersion) {
        console.warn("No active version found when clearing versions");
        setClearConfirmationState(false);
        setOpen(false);
        return;
      }
      
      const newVersion: ContentVersionType = {
        id: `version-${Date.now()}`,
        content: activeVersion.content,
        timestamp: new Date().toISOString(),
        source: activeVersion.source,
        active: true,
        versionNumber: activeVersion.versionNumber
      };
      
      if (onContentVersionsChange) {
        onContentVersionsChange([newVersion]);
      } else {
        setInternalContentVersions([newVersion]);
      }
      
      handleEditorChange(activeVersion.content);
      
      if (onClearAllVersions) {
        onClearAllVersions();
      }
      
      contentEditedAfterInitialLoad.current = false;
      contentEditedAfterAIGeneration.current = false;
      lastAIGeneratedContent.current = null;
      
      setClearConfirmationState(false);
      setOpen(false);
    } else {
      setClearConfirmationState(true);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setClearConfirmationState(false);
    }
  };

  const handleEditorChange = (content: string) => {
    if (onEditorChange) {
      onEditorChange(content);
    }
    setInternalEditorContent(content);
  };

  const handleSelectVersion = (version: ContentVersionType) => {
    const newContent = version.content;
    handleEditorChange(newContent);
    
    const updatedVersions = (onContentVersionsChange ? editorContentVersions : internalContentVersions).map(v => ({
      ...v,
      active: v.id === version.id
    }));
    
    if (onContentVersionsChange) {
      onContentVersionsChange(updatedVersions);
    } else {
      setInternalContentVersions(updatedVersions);
    }
    
    setOpen(false);
  };

  const createNewVersion = (content: string, source: string): ContentVersionType => {
    const currentVersions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    
    const highestVersion = currentVersions.reduce(
      (max, v) => (v.versionNumber > max ? v.versionNumber : max), 
      0
    );
    
    return {
      id: `version-${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      source,
      active: true,
      versionNumber: highestVersion + 1
    };
  };

  const addVersionToState = (newVersion: ContentVersionType) => {
    const currentVersions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    
    const updatedVersions = currentVersions.map(v => ({
      ...v,
      active: false
    }));
    
    const newVersions = [...updatedVersions, newVersion];
    
    if (onContentVersionsChange) {
      onContentVersionsChange(newVersions);
    } else {
      setInternalContentVersions(newVersions);
    }
  };

  const getActiveVersionContent = (): string => {
    const currentVersions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    const activeVersion = currentVersions.find(v => v.active);
    return activeVersion?.content || '';
  };

  const generateContentWithAI = async () => {
    if (!generatorSlug) {
      console.warn("Cannot generate content: No generator slug provided");
      toast({
        title: "Error",
        description: "No AI generator selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      isProcessingAIGeneration.current = true;
      setIsGenerating(true);
      
      const currentContent = onEditorChange ? editorContent : internalEditorContent;
      
      toast({
        title: "Generating content",
        description: "Generating content with AI...",
      });
      
      const parameters = {
        ...(generationParameters || {}),
        currentContent
      };
      
      // Determine the response format based on the editor type
      const responseFormat = editorType === 'rich' ? 'html' : 'markdown';
      
      const { data, error } = await supabase.functions.invoke('generate-with-ai-settings', {
        body: {
          slug: generatorSlug,
          parameters: parameters,
          responseFormat: responseFormat
        }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to generate content");
      }
      
      if (!data || !data.content) {
        throw new Error("No content returned from AI generator");
      }
      
      const aiGeneratedContent = data.content;
      const aiVersion = createNewVersion(aiGeneratedContent, "AI generated");
      
      addVersionToState(aiVersion);
      
      handleEditorChange(aiGeneratedContent);
      
      lastAIGeneratedContent.current = aiGeneratedContent;
      
      contentEditedAfterAIGeneration.current = false;
      
      toast({
        title: "Content generated",
        description: "Content has been generated successfully",
      });
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        isProcessingAIGeneration.current = false;
      }, 100);
    }
  };

  const handleButtonClick = async () => {
    if (onButtonClick) {
      await onButtonClick();
    } else if (generatorSlug) {
      await generateContentWithAI();
    } else {
      await handleAIGeneration();
    }
  };

  const handleAIGeneration = async () => {
    isProcessingAIGeneration.current = true;
    
    const currentContent = onEditorChange ? editorContent : internalEditorContent;
    
    const aiGeneratedContent = `<p>AI-generated content based on: "${currentContent.substring(0, 30)}..."</p>`;
    
    const aiVersion = createNewVersion(aiGeneratedContent, "AI generated");
    
    addVersionToState(aiVersion);
    
    handleEditorChange(aiGeneratedContent);
    
    lastAIGeneratedContent.current = aiGeneratedContent;
    
    contentEditedAfterAIGeneration.current = false;
    
    setTimeout(() => {
      isProcessingAIGeneration.current = false;
    }, 100);
  };

  const getContentVersionOptions = (): DropdownOption[] => {
    const versions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    
    return [...versions]
      .sort((a, b) => b.versionNumber - a.versionNumber)
      .map(version => ({
        id: version.id,
        label: `Version ${version.versionNumber}`,
        version: `v${version.versionNumber}`,
        date: new Date(version.timestamp).toLocaleString(),
        source: version.source === 'AI generated' 
          ? 'AI Generated' 
          : version.source === 'manual' 
            ? 'Manual Input' 
            : version.source
      }));
  };

  const getActiveVersionId = (): string | undefined => {
    const versions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    const activeVersion = versions.find(v => v.active);
    return activeVersion?.id;
  };

  // Format parameters for display in hovercard
  const formatParametersForDisplay = () => {
    if (!generationParameters) return null;
    
    return Object.entries(generationParameters).map(([key, value]) => {
      // Format the value for display
      let displayValue = value;
      
      // Convert arrays and objects to strings for display
      if (Array.isArray(value)) {
        displayValue = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        displayValue = JSON.stringify(value);
      }
      
      // Truncate long string values
      if (typeof displayValue === 'string' && displayValue.length > 50) {
        displayValue = `${displayValue.substring(0, 50)}...`;
      }
      
      return { key, value: displayValue };
    });
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {showEditor && (
        <div className="flex justify-between items-center mb-2">
          {contentName && <h3 className="font-medium text-base">{contentName}</h3>}
          <div className="flex items-center gap-2">
            <div className="flex">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleButtonClick}
                    disabled={disabled || isGenerating}
                    className="flex items-center gap-1 rounded-r-none border-r-0"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isGenerating ? loadingLabel : buttonLabel}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-auto min-w-[280px] p-4" side="top">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">AI Generation Configuration</h4>
                    
                    {hoverCardConfig && (
                      <div className="space-y-2">
                        {hoverCardConfig.promptTitle && (
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-muted-foreground">Generator:</span>
                            <span className="col-span-2 font-medium break-words">{hoverCardConfig.promptTitle}</span>
                          </div>
                        )}
                        
                        {hoverCardConfig.aiProvider && (
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-muted-foreground">AI Provider:</span>
                            <span className="col-span-2 font-medium break-words">{hoverCardConfig.aiProvider}</span>
                          </div>
                        )}
                        
                        {hoverCardConfig.generatorSlug && (
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-muted-foreground">Slug:</span>
                            <span className="col-span-2 font-medium break-words">{hoverCardConfig.generatorSlug}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Display generation parameters */}
                    {generationParameters && Object.keys(generationParameters).length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold text-muted-foreground mt-2">Parameters</h5>
                        <div className="bg-muted rounded-md p-2">
                          {formatParametersForDisplay()?.map(({ key, value }) => (
                            <div key={key} className="grid grid-cols-3 gap-2 text-sm py-1">
                              <span className="text-muted-foreground truncate">{key}:</span>
                              <span className="col-span-2 break-words text-xs">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </HoverCardContent>
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
                    
                    {getContentVersionOptions().length > 0 && (
                      <div className="border-t mt-auto sticky bottom-0 bg-popover">
                        <DropdownMenuItem
                          onClick={handleClearAllVersions}
                          className="py-2 text-destructive hover:bg-destructive/10"
                          onSelect={(e) => {
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

      {!showEditor && (
        <div className="flex">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleButtonClick}
                disabled={disabled || isGenerating}
                className="flex items-center gap-1 rounded-r-none border-r-0"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? loadingLabel : buttonLabel}
              </Button>
            </HoverCardTrigger>
            {hoverCardConfig && (
              <HoverCardContent className="w-auto min-w-[280px] p-4" side="top">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">AI Generation Configuration</h4>
                  
                  <div className="space-y-2">
                    {hoverCardConfig.promptTitle && (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-muted-foreground">Generator:</span>
                        <span className="col-span-2 font-medium break-words">{hoverCardConfig.promptTitle}</span>
                      </div>
                    )}
                    
                    {hoverCardConfig.aiProvider && (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-muted-foreground">AI Provider:</span>
                        <span className="col-span-2 font-medium break-words">{hoverCardConfig.aiProvider}</span>
                      </div>
                    )}
                    
                    {hoverCardConfig.generatorSlug && (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-muted-foreground">Slug:</span>
                        <span className="col-span-2 font-medium break-words">{hoverCardConfig.generatorSlug}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Display generation parameters */}
                  {generationParameters && Object.keys(generationParameters).length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-muted-foreground mt-2">Parameters</h5>
                      <div className="bg-muted rounded-md p-2">
                        {formatParametersForDisplay()?.map(({ key, value }) => (
                          <div key={key} className="grid grid-cols-3 gap-2 text-sm py-1">
                            <span className="text-muted-foreground truncate">{key}:</span>
                            <span className="col-span-2 break-words text-xs">{String(value)}</span>
                          </div>
                        ))}
                      </div>
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
                
                {getContentVersionOptions().length > 0 && (
                  <div className="border-t mt-auto sticky bottom-0 bg-popover">
                    <DropdownMenuItem
                      onClick={handleClearAllVersions}
                      className="py-2 text-destructive hover:bg-destructive/10"
                      onSelect={(e) => {
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
      
      {showEditor && (
        <div>
          {editorType === 'rich' ? (
            <div className="border rounded-md">
              <div className="min-h-[300px]">
                <Editor
                  value={onEditorChange ? editorContent : internalEditorContent}
                  onChange={handleEditorChange}
                  onBlur={handleEditorBlur}
                  placeholder={editorPlaceholder}
                />
              </div>
            </div>
          ) : (
            <Textarea
              value={onEditorChange ? editorContent : internalEditorContent}
              onChange={(e) => handleEditorChange(e.target.value)}
              onBlur={handleEditorBlur}
              placeholder={editorPlaceholder}
              className="min-h-[300px] w-full resize-none"
            />
          )}
        </div>
      )}
    </div>
  );
}
