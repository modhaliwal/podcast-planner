
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

const quillStyles = {
  height: '200px',
  marginBottom: '50px',
};

export function NotesSection({ notes, setNotes }: NotesSectionProps) {
  return (
    <div className="mt-10 pt-4">
      <FormLabel>Personal Notes</FormLabel>
      <div className="border rounded-md mt-2">
        <ReactQuill 
          value={notes} 
          onChange={setNotes} 
          modules={quillModules}
          formats={quillFormats}
          placeholder="Private notes about this guest"
          theme="snow"
          className="bg-background resize-vertical"
          style={quillStyles}
        />
      </div>
    </div>
  );
}
