
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { convertMarkdownToHtml } from "./utils/researchUtils";

interface ResearchEditorComponentProps {
  backgroundResearch: string;
  onContentChange: (content: string) => void;
}

// Quill editor configuration with more comprehensive toolbar
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
];

export function ResearchEditorComponent({ 
  backgroundResearch, 
  onContentChange 
}: ResearchEditorComponentProps) {
  // State to store HTML content for ReactQuill
  const [editorContent, setEditorContent] = useState('');

  // Effect to convert markdown to HTML when backgroundResearch changes
  useEffect(() => {
    const updateEditorContent = async () => {
      if (!backgroundResearch) {
        setEditorContent('');
        return;
      }
      
      const html = await convertMarkdownToHtml(backgroundResearch);
      setEditorContent(html);
    };
    
    updateEditorContent();
  }, [backgroundResearch]);

  // Handle editor content change
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    onContentChange(content);
  };

  return (
    <div className="border rounded-md">
      <ReactQuill 
        value={editorContent} 
        onChange={handleEditorChange} 
        modules={quillModules}
        formats={quillFormats}
        placeholder="Research information about this guest"
        theme="snow"
        className="bg-background min-h-[200px]"
      />
    </div>
  );
}
