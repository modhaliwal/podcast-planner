
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FormLabel } from "@/components/ui/form";

interface BackgroundResearchSectionProps {
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
}

export function BackgroundResearchSection({ 
  backgroundResearch, 
  setBackgroundResearch 
}: BackgroundResearchSectionProps) {
  const handleChange = (content: string) => {
    console.log("Background research changed:", content);
    setBackgroundResearch(content);
  };

  return (
    <div className="space-y-4">
      <FormLabel>Background Research</FormLabel>
      <ReactQuill
        theme="snow"
        value={backgroundResearch}
        onChange={handleChange}
        className="bg-background min-h-[200px]"
        placeholder="Add background research notes here..."
      />
    </div>
  );
}
