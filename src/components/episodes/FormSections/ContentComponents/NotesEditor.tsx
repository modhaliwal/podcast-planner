
import { Editor } from "@/components/editor/Editor";
import { FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useNotesVersions } from "@/contexts/NotesVersionsContext";
import { EpisodeFormValues } from "../../EpisodeFormSchema";

interface NotesEditorProps {
  onBlur: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function NotesEditor({
  onBlur,
  placeholder = "Add episode notes here...",
  readOnly = false
}: NotesEditorProps) {
  const form = useFormContext<EpisodeFormValues>();
  const fieldName = "notes";
  
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
