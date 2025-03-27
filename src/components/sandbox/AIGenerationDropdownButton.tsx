
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  className?: string;
  showNotification?: boolean;
}

/**
 * A specialized button for AI content generation with a dropdown menu.
 * Clicking the main button triggers the primary action, while the dropdown
 * icon shows a menu of alternative options.
 */
export function AIGenerationDropdownButton({
  buttonLabel = "Generate",
  loadingLabel = "Generating...",
  isGenerating = false,
  disabled = false,
  options,
  onButtonClick,
  onOptionSelect,
  className,
  showNotification = false,
}: AIGenerationDropdownButtonProps) {
  // State to manage the dropdown open state
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex", className)}>
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
      <DropdownMenu open={open} onOpenChange={setOpen}>
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
        <DropdownMenuContent align="end" className="w-84">
          <ScrollArea className="h-72">
            {options.map(option => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => {
                  onOptionSelect(option);
                  setOpen(false);
                }}
                className="flex flex-col items-start py-2"
              >
                <div className="flex items-center gap-2 mb-1">
                  {option.version && (
                    <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">
                      {option.version}
                    </span>
                  )}
                  {option.date && (
                    <span className="text-xs text-muted-foreground">
                      {option.date}
                    </span>
                  )}
                </div>
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-muted-foreground mt-1">{option.description}</span>
                )}
                {option.source && (
                  <span className="text-xs text-muted-foreground mt-1 italic">
                    {option.source}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
