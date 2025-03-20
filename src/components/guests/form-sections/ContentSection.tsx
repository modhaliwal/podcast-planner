
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Sparkles } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "sonner";

interface ContentSectionProps {
  form: UseFormReturn<any>;
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

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

export function ContentSection({ 
  form, 
  backgroundResearch, 
  setBackgroundResearch,
  notes,
  setNotes
}: ContentSectionProps) {
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);

  const generateBio = async () => {
    setIsGeneratingBio(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const name = form.getValues('name');
      const title = form.getValues('title');
      
      const generatedBio = `${name} is a distinguished ${title} with extensive experience in their field. Known for innovative approaches and thought leadership, they have contributed significantly to industry advancements. Their unique perspective and insights make them a valuable voice in current discussions and an engaging podcast guest.`;
      
      form.setValue('bio', generatedBio);
      toast.success("Bio generated successfully");
    } catch (error) {
      toast.error("Failed to generate bio");
      console.error(error);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const generateBackgroundResearch = async () => {
    setIsGeneratingResearch(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const name = form.getValues('name');
      const title = form.getValues('title');
      
      const generatedResearch = `<h3>Research findings for ${name}:</h3>
      
<ol>
  <li><strong>Educational background:</strong> Graduated with honors in relevant field.</li>
  <li><strong>Career highlights:</strong> Has over 10 years of experience as a ${title}.</li>
  <li><strong>Previous media appearances:</strong> Has been featured on several industry podcasts.</li>
  <li><strong>Publications:</strong> Author of multiple well-received articles in industry journals.</li>
  <li><strong>Areas of expertise:</strong> Specializes in emerging trends and practical applications.</li>
  <li><strong>Speaking style:</strong> Articulate, engaging, with a talent for making complex topics accessible.</li>
  <li><strong>Recent projects:</strong> Currently involved in several innovative initiatives.</li>
  <li><strong>Social media presence:</strong> Active on professional platforms with substantial following.</li>
</ol>

<h3>Recommended topics to explore:</h3>
<ul>
  <li>Their journey to becoming a ${title}</li>
  <li>Their perspective on industry challenges and opportunities</li>
  <li>Their vision for the future of their field</li>
</ul>`;
      
      setBackgroundResearch(generatedResearch);
      toast.success("Background research generated successfully");
    } catch (error) {
      toast.error("Failed to generate background research");
      console.error(error);
    } finally {
      setIsGeneratingResearch(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Bio</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={generateBio}
          disabled={isGeneratingBio}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {isGeneratingBio ? 'Generating...' : 'Generate Bio'}
        </Button>
      </div>
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea 
                {...field} 
                rows={8}
                placeholder="Guest biography" 
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex items-center justify-between">
        <FormLabel>Background Research</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={generateBackgroundResearch}
          disabled={isGeneratingResearch}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {isGeneratingResearch ? 'Generating...' : 'Generate Research'}
        </Button>
      </div>
      <div className="border rounded-md">
        <ReactQuill 
          value={backgroundResearch} 
          onChange={setBackgroundResearch} 
          modules={quillModules}
          formats={quillFormats}
          placeholder="Research information about this guest"
          theme="snow"
          className="bg-background resize-vertical"
          style={quillStyles}
        />
      </div>

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
    </div>
  );
}
