
import { Editor } from "@/components/editor/Editor";
import { FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { memo, useCallback } from "react";
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
  
  const handleContentChange = useCallback((value: string) => {
    form.setValue(fieldName, value, { shouldDirty: true });
  }, [form]);

  return (
    <FormControl>
      <Editor
        value={form.getValues(fieldName) || ""}
        onChange={handleContentChange}
        onBlur={onBlur}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </FormControl>
  );
});
