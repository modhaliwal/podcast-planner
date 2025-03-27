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

export type DropdownOption = {
  id: string;
  label: string;
  description?: string;
  version?: string;
  date?: string;
  source?: 'Manual Input' | 'AI Generated' | 'Imported';
};

export interface ContentVersion {
  id: string;
  content: string;
  timestamp: string;
  source: 'manual' | 'ai' | 'imported';
  active: boolean;
  versionNumber: number;
}

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
  hoverCardConfig?: {
    aiProvider?: string;
    promptKey?: string;
    promptTitle?: string;
    edgeFunctionName?: string;
  };
  editorContent?: string;
  onEditorChange?: (content: string) => void;
  showEditor?: boolean;
  editorPlaceholder?: string;
  editorMinHeight?: number;
  contentName?: string;
  editorType?: 'rich' | 'plain';
  editorContentVersions?: ContentVersion[];
  onContentVersionsChange?: (versions: ContentVersion[]) => void;
}

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
  const [open, setOpen] = useState(false);
  const [clearConfirmationState, setClearConfirmationState] = useState(false);
  const [internalEditorContent, setInternalEditorContent] = useState(editorContent);
  const [currentEditorType, setCurrentEditorType] = useState<'rich' | 'plain'>(editorType);
  const [internalContentVersions, setInternalContentVersions] = useState<ContentVersion[]>(editorContentVersions);

  useEffect(() => {
    if (editorContentVersions.length > 0) {
      setInternalContentVersions(editorContentVersions);
    }
  }, [editorContentVersions]);

  const handleClearAllVersions = () => {
    if (clearConfirmationState) {
      const currentVersions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
      const activeVersion = currentVersions.find(v => v.active);
      
      const currentDisplayedContent = onEditorChange ? editorContent : internalEditorContent;
      
      const newVersion: ContentVersion = {
        id: `version-${Date.now()}`,
        content: currentDisplayedContent,
        timestamp: new Date().toISOString(),
        source: activeVersion?.source || 'manual',
        active: true,
        versionNumber: activeVersion?.versionNumber || 1
      };
      
      if (onClearAllVersions) {
        onClearAllVersions();
      }
      
      if (onContentVersionsChange) {
        onContentVersionsChange([newVersion]);
      } else {
        setInternalContentVersions([newVersion]);
      }
      
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
    } else {
      setInternalEditorContent(content);
    }
  };

  const handleEditorTypeChange = (value: string) => {
    if (value) {
      setCurrentEditorType(value as 'rich' | 'plain');
    }
  };

  const handleSelectVersion = (version: ContentVersion) => {
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

  const addVersion = (content: string, source: 'manual' | 'ai' | 'imported' = 'manual') => {
    const currentVersions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    
    const highestVersion = currentVersions.reduce(
      (max, v) => (v.versionNumber > max ? v.versionNumber : max), 
      0
    );
    
    const newVersion: ContentVersion = {
      id: `version-${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      source,
      active: true,
      versionNumber: highestVersion + 1
    };
    
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
    
    return newVersion;
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
        source: version.source === 'manual' 
          ? 'Manual Input' 
          : version.source === 'ai' 
            ? 'AI Generated' 
            : 'Imported'
      }));
  };

  const getActiveVersionId = (): string | undefined => {
    const versions = onContentVersionsChange ? editorContentVersions : internalContentVersions;
    const activeVersion = versions.find(v => v.active);
    return activeVersion?.id;
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {showEditor && (
        <div className="flex justify-between items-center mb-2">
          {contentName && <h3 className="font-medium text-base">{contentName}</h3>}
          <div className="flex items-center gap-2">
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
          {currentEditorType === 'rich' ? (
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
