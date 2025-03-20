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
import { Facebook, Linkedin, Instagram, Globe, Youtube, Plus, Trash, Sparkles, Building, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => void;
  onCancel: () => void;
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

export function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
  const [socialLinks, setSocialLinks] = useState(guest.socialLinks);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);
  const [backgroundResearch, setBackgroundResearch] = useState(guest.backgroundResearch || "");
  const [notes, setNotes] = useState(guest.notes || "");
  const [imagePreview, setImagePreview] = useState<string | undefined>(guest.imageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const form = useForm({
    defaultValues: {
      name: guest.name,
      title: guest.title,
      company: guest.company || "",
      email: guest.email || "",
      phone: guest.phone || "",
      bio: guest.bio,
      status: guest.status || "potential",
      twitter: socialLinks.twitter || "",
      facebook: socialLinks.facebook || "",
      linkedin: socialLinks.linkedin || "",
      instagram: socialLinks.instagram || "",
      tiktok: socialLinks.tiktok || "",
      youtube: socialLinks.youtube || "",
      website: socialLinks.website || "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG or WebP)");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image is too large. Maximum size is 10MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
    toast.success("Image uploaded successfully");
  };

  const handleSubmit = (data: any) => {
    const updatedGuest: Guest = {
      ...guest,
      name: data.name,
      title: data.title,
      company: data.company || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      bio: data.bio,
      notes: notes || undefined,
      backgroundResearch: backgroundResearch || undefined,
      status: data.status,
      imageUrl: imageFile ? imagePreview : guest.imageUrl,
      socialLinks: {
        twitter: data.twitter || undefined,
        facebook: data.facebook || undefined,
        linkedin: data.linkedin || undefined,
        instagram: data.instagram || undefined,
        tiktok: data.tiktok || undefined,
        youtube: data.youtube || undefined,
        website: data.website || undefined,
      },
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedGuest);
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== guest.imageUrl) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, guest.imageUrl]);

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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="mb-4 w-full max-w-[240px]">
                  <AspectRatio ratio={2/3} className="bg-muted rounded-md overflow-hidden border">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt={form.getValues('name')}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-muted">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </AspectRatio>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="headshot-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md hover:bg-accent transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Upload Headshot</span>
                    </div>
                    <Input 
                      id="headshot-upload" 
                      type="file" 
                      className="hidden" 
                      onChange={handleImageChange}
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </Label>
                  
                  {imagePreview && imagePreview !== guest.imageUrl && (
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview(guest.imageUrl);
                        setImageFile(null);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Supports JPEG, PNG or WebP up to 10MB. High-resolution images recommended.
                </p>
              </div>

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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                      <FormLabel>Company/Organization</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder="Company or organization name" />
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
                      <svg className="w-4 h-4 mr-2 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <FormLabel>X (Twitter)</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder="https://x.com/username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Facebook className="w-4 h-4 mr-2 text-muted-foreground" />
                      <FormLabel>Facebook</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder="https://facebook.com/username" />
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
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 10v7.65c0 .2-.08.4-.22.54-.14.16-.33.22-.54.22-.42 0-.76-.34-.76-.76V10H6c-.55 0-1-.45-1-1s.45-1 1-1h7.68c.3 0 .59-.13.8-.34.19-.2.31-.46.31-.73 0-.76-.36-1.47-.97-1.92.03 0 .06-.01.09-.01.74 0 1.39.49 1.6 1.2.26.92 1.23 1.55 2.2 1.36.56-.1.98-.55 1.09-1.11.06-.29.09-.59.09-.88 0-.44-.09-.85-.26-1.23-.32-.74-1.05-1.26-1.9-1.33-.2-.02-.39-.03-.59-.03-1.94 0-3.77.91-4.94 2.42-.43.55-1.21.72-1.84.43-.14-.06-.24-.19-.28-.34-.04-.14-.04-.29.02-.43C10.57 2.35 13.23 1 16.11 1c.33 0 .66.02.98.05 0 0 1.27.14 2.35.83.16.1.32.22.47.34 0 0 1.43 1.19 1.96 2.72.13.37.21.76.25 1.16.04.47.04.92-.02 1.36-.18 1.36-1.23 2.45-2.58 2.72-.47.09-.95.08-1.41-.01V16.5c0 1.82-.82 3.5-2.24 4.63-1.18.94-2.66 1.32-4.12 1.1-2.38-.37-4.24-2.36-4.47-4.76-.09-.94.08-1.88.5-2.73.35-.7.88-1.33 1.55-1.83.08-.06.22-.17.22-.17V10z" />
                      </svg>
                      <FormLabel>TikTok</FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder="https://tiktok.com/@username" />
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
