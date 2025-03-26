
import { Editor } from "@/components/editor/Editor";
import { FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EpisodeFormValues } from "../../EpisodeFormSchema";

interface NotesEditorProps {
  form: UseFormReturn<EpisodeFormValues>;
  fieldName: string;
  onBlur: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function NotesEditor({
  form,
  fieldName,
  onBlur,
  placeholder = "Add episode notes here...",
  readOnly = false
}: NotesEditorProps) {
  const handleContentChange = (value: string) => {
    form.setValue(fieldName, value);
  };

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
}
