import React, { useState } from 'react';
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

// Types for the dropdown options
export type DropdownOption = {
  id: string;
  label: string;
  description?: string;
  version?: string;
  date?: string;
  source?: 'Manual Input' | 'AI Generated' | 'Imported';
};

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
  showNotification = false,
  selectedOptionId,
  hoverCardConfig,
}: AIGenerationDropdownButtonProps) {
  // State to manage the dropdown open state
  const [open, setOpen] = useState(false);
  // State to track if user has clicked "Clear all versions" once
  const [clearConfirmationState, setClearConfirmationState] = useState(false);

  // Handler for the clear all versions option
  const handleClearAllVersions = () => {
    if (clearConfirmationState) {
      // User confirmed, trigger the clear action
      if (onClearAllVersions) {
        onClearAllVersions();
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

  return (
    <div className={cn("flex", className)}>
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
            {showNotification && options.length > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                {options.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto min-w-[280px]">
          <div className="flex flex-col h-72">
            {/* Scrollable area for options */}
            <ScrollArea className="flex-grow">
              <div className="pr-4 py-1">
                {options.map(option => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => {
                      onOptionSelect(option);
                      setOpen(false);
                    }}
                    className="py-2"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      {selectedOptionId === option.id && (
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
            {onClearAllVersions && options.length > 0 && (
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
  );
}
