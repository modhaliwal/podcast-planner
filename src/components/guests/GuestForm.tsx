
import { useState, useEffect } from "react";
import { Guest } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Twitter, Linkedin, Instagram, Globe, Youtube, Plus, Trash, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => void;
  onCancel: () => void;
}

// Rich text editor modules and formats configuration
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

export function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
  const [socialLinks, setSocialLinks] = useState(guest.socialLinks);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);
  const [backgroundResearch, setBackgroundResearch] = useState(guest.backgroundResearch || "");
  const [notes, setNotes] = useState(guest.notes || "");

  const form = useForm({
    defaultValues: {
      name: guest.name,
      title: guest.title,
      email: guest.email || "",
      phone: guest.phone || "",
      bio: guest.bio,
      status: guest.status || "potential",
      twitter: socialLinks.twitter || "",
      linkedin: socialLinks.linkedin || "",
      instagram: socialLinks.instagram || "",
      youtube: socialLinks.youtube || "",
      website: socialLinks.website || "",
    },
  });

  const handleSubmit = (data: any) => {
    // Update the guest object with form data
    const updatedGuest: Guest = {
      ...guest,
      name: data.name,
      title: data.title,
      email: data.email || undefined,
      phone: data.phone || undefined,
      bio: data.bio,
      notes: notes || undefined,
      backgroundResearch: backgroundResearch || undefined,
      status: data.status,
      socialLinks: {
        twitter: data.twitter || undefined,
        linkedin: data.linkedin || undefined,
        instagram: data.instagram || undefined,
        youtube: data.youtube || undefined,
        website: data.website || undefined,
      },
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedGuest);
  };

  const generateBio = async () => {
    setIsGeneratingBio(true);
    try {
      // In a real app, this would be a call to an AI service
      // For now, we'll simulate a delay and generate a simple bio
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
      // In a real app, this would be a call to an AI service
      // For now, we'll simulate a delay and generate simple research
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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title/Role</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="potential">
                          <div className="flex items-center gap-2">
                            Potential
                            <Badge variant="outline">Potential</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="contacted">
                          <div className="flex items-center gap-2">
                            Contacted
                            <Badge variant="secondary">Contacted</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="confirmed">
                          <div className="flex items-center gap-2">
                            Confirmed
                            <Badge variant="default">Confirmed</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="appeared">
                          <div className="flex items-center gap-2">
                            Appeared
                            <Badge variant="success">Appeared</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Social Links</h3>
              
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Twitter className="w-4 h-4 mr-2 text-muted-foreground" />
                      <FormLabel>Twitter</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder="https://twitter.com/username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Linkedin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <FormLabel>LinkedIn</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder="https://linkedin.com/in/username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Instagram className="w-4 h-4 mr-2 text-muted-foreground" />
                      <FormLabel>Instagram</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder="https://instagram.com/username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Youtube className="w-4 h-4 mr-2 text-muted-foreground" />
                      <FormLabel>YouTube</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/@username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                      <FormLabel>Website</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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
                      rows={5}
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
                className="bg-background"
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
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
