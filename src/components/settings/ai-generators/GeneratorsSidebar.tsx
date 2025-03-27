
import { AIPrompt } from "@/hooks/useAIPrompts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface GeneratorsSidebarProps {
  prompts: AIPrompt[];
  activePromptSlug: string | null;
  onSelectPrompt: (promptSlug: string) => void;
  isAdding: boolean;
  onAddNew: () => void;
}

export function GeneratorsSidebar({
  prompts,
  activePromptSlug,
  onSelectPrompt,
  isAdding
}: GeneratorsSidebarProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-240px)] border rounded-md">
        <p className="text-muted-foreground">No generators found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-240px)] rounded-md border">
      <div className="p-2">
        {prompts.map((prompt) => (
          <button
            key={prompt.slug}
            onClick={() => onSelectPrompt(prompt.slug)}
            className={cn(
              "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary/50",
              activePromptSlug === prompt.slug ? "bg-secondary" : "",
              isAdding ? "opacity-50 pointer-events-none" : ""
            )}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">{prompt.title}</span>
              <span className="text-xs text-muted-foreground truncate">
                {prompt.slug}
              </span>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
