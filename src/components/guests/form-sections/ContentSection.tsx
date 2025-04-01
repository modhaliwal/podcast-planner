
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BioSection } from "./bio";
import { BackgroundResearchSection } from "./background-research";
import { UseFormReturn } from "react-hook-form";
import { Guest } from "@/lib/types";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ContentSectionProps {
  form: UseFormReturn<any>;
  guest?: Guest;
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

export function ContentSection({ form, guest }: ContentSectionProps) {
  // Notes handling directly in this component
  const notes = form.watch('notes') || '';
  
  const handleNotesChange = (content: string) => {
    form.setValue('notes', content, { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="bio" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bio">Bio</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bio" className="pt-4">
          <BioSection form={form} guest={guest} />
        </TabsContent>
        
        <TabsContent value="research" className="pt-4">
          <BackgroundResearchSection form={form} guest={guest} />
        </TabsContent>
        
        <TabsContent value="notes" className="pt-4">
          <div>
            <h3 className="font-medium text-base">Notes</h3>
            <ReactQuill 
              value={notes} 
              onChange={handleNotesChange} 
              modules={quillModules}
              formats={quillFormats}
              placeholder="Private notes about this guest"
              theme="snow"
              className="bg-background resize-vertical h-[300px]"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
