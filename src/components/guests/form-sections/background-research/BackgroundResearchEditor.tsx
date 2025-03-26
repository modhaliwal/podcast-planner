
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FormLabel } from "@/components/ui/form";

interface BackgroundResearchEditorProps {
  backgroundResearch: string;
  onChangeBackgroundResearch: (value: string) => void;
  onBlur: () => void;
}

export function BackgroundResearchEditor({ 
  backgroundResearch, 
  onChangeBackgroundResearch,
  onBlur
}: BackgroundResearchEditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={backgroundResearch}
      onChange={onChangeBackgroundResearch}
      onBlur={onBlur}
      className="bg-background min-h-[200px]"
      placeholder="Add background research notes here..."
    />
  );
}
