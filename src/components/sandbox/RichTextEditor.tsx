
import { Editor } from "@/components/editor/Editor";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <div className="border rounded-md">
      <Editor
        value={value}
        onChange={onChange}
        placeholder="Generated rich text content will appear here..."
      />
    </div>
  );
}
