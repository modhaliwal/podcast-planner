
import { Editor } from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import { ContentVersion } from "@/lib/types";
import { useState } from "react";

interface NotesEditorProps {
  content: string;
  setContent: (content: string) => void;
  activeVersion: ContentVersion | null;
  isLatestVersionActive: boolean;
  onSaveContent: (content: string) => ContentVersion[];
}

export function NotesEditor({ 
  content, 
  setContent, 
  activeVersion, 
  isLatestVersionActive,
  onSaveContent 
}: NotesEditorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveContent = async (newContent: string) => {
    try {
      setIsLoading(true);
      onSaveContent(newContent);
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Editor
        value={content}
        onChange={setContent}
        onSave={handleSaveContent}
        placeholder="Start typing your notes here..."
        key={`editor-${activeVersion?.id || 'default'}`}
      />
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {activeVersion ? (
            <>
              Editing version from {new Date(activeVersion.timestamp).toLocaleString()}
              {!isLatestVersionActive && (
                <span className="ml-2 text-yellow-500">
                  (This is not the latest version)
                </span>
              )}
            </>
          ) : (
            "Create your first version by saving"
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleSaveContent(content)}
          disabled={isLoading}
        >
          Save Version
        </Button>
      </div>
    </>
  );
}
