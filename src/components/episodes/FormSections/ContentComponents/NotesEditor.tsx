
import { Editor } from "@/components/editor/Editor";
import { FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { memo, useCallback, useEffect, useRef } from "react";
import { EpisodeFormValues } from "../../EpisodeFormSchema";

interface NotesEditorProps {
  onBlur: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

export const NotesEditor = memo(function NotesEditor({
  onBlur,
  placeholder = "Add episode notes here...",
  readOnly = false
}: NotesEditorProps) {
  const form = useFormContext<EpisodeFormValues>();
  const fieldName = "notes";
  const contentRef = useRef<string>(form.getValues(fieldName) || "");
  
  // Track content changes to prevent unnecessary re-renders
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === fieldName && value[fieldName] !== contentRef.current) {
        contentRef.current = value[fieldName] || "";
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  const handleContentChange = useCallback((value: string) => {
    if (value !== contentRef.current) {
      contentRef.current = value;
      form.setValue(fieldName, value, { shouldDirty: true });
    }
  }, [form]);

  return (
    <FormControl>
      <Editor
        value={contentRef.current}
        onChange={handleContentChange}
        onBlur={onBlur}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </FormControl>
  );
});
