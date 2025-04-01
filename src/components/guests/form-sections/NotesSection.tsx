
import { FormLabel } from "@/components/ui/form";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface NotesSectionProps {
  notes: string;
  setNotes: (value: string) => void;
}

// Quill editor configuration
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

export function NotesSection({ notes, setNotes }: NotesSectionProps) {
  return (
    <div>
      <h3 className="font-medium text-base">Notes</h3>
      <ReactQuill 
        value={notes} 
        onChange={setNotes} 
        modules={quillModules}
        formats={quillFormats}
        placeholder="Private notes about this guest"
        theme="snow"
        className="bg-background resize-vertical h-[300px]"
      />
    </div>
  );
}
