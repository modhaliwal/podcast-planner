
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { FormProvider } from "react-hook-form";
import { GuestImageState } from "./form/GuestImageState";
import { Guest } from "@/lib/types";
import { useGuestForm } from "@/hooks/guests/useGuestForm";
import { HeadshotSection } from "./form-sections/HeadshotSection";
import { NotesSection } from "./form-sections/NotesSection";
import { SocialLinks } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormActions } from "@/components/ui/form-actions";
import {
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  Youtube,
  Facebook,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import your schema
const GuestFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  bio: z.string().optional(),
  status: z.enum(["potential", "contacted", "confirmed", "appeared"]).optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  website: z.string().optional(),
});

type GuestFormValues = z.infer<typeof GuestFormSchema>;

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => Promise<any>;
  onCancel: () => void;
}

export function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(guest?.notes || "");
  
  const {
    form,
    isSubmitting,
    handleSubmit,
    handleImageChange
  } = useGuestForm({ guest, onSave, onCancel });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => handleSubmit(values, notes))} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Basic Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                          <SelectItem value="potential">Potential</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="appeared">Appeared</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
            
            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
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
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
            
            {/* Social Links */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Social Links</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <FormLabel className="mb-0">X (Twitter)</FormLabel>
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
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <Linkedin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <FormLabel className="mb-0">LinkedIn</FormLabel>
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
                        <FormLabel className="mb-0">Instagram</FormLabel>
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
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <Facebook className="w-4 h-4 mr-2 text-muted-foreground" />
                        <FormLabel className="mb-0">Facebook</FormLabel>
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
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <Youtube className="w-4 h-4 mr-2 text-muted-foreground" />
                        <FormLabel className="mb-0">YouTube</FormLabel>
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
                  name="tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 10v7.65c0 .2-.08.4-.22.54-.14.16-.33.22-.54.22-.42 0-.76-.34-.76-.76V10H6c-.55 0-1-.45-1-1s.45-1 1-1h7.68c.3 0 .59-.13.8-.34.19-.2.31-.46.31-.73 0-.76-.36-1.47-.97-1.92.03 0 .06-.01.09-.01.74 0 1.39.49 1.6 1.2.26.92 1.23 1.55 2.2 1.36.56-.1.98-.55 1.09-1.11.06-.29.09-.59.09-.88 0-.44-.09-.85-.26-1.23-.32-.74-1.05-1.26-1.9-1.33-.2-.02-.39-.03-.59-.03-1.94 0-3.77.91-4.94 2.42-.43.55-1.21.72-1.84.43-.14-.06-.24-.19-.28-.34-.04-.14-.04-.29.02-.43C10.57 2.35 13.23 1 16.11 1c.33 0 .66.02.98.05 0 0 1.27.14 2.35.83.16.1.32.22.47.34 0 0 1.43 1.19 1.96 2.72.13.37.21.76.25 1.16.04.47.04.92-.02 1.36-.18 1.36-1.23 2.45-2.58 2.72-.47.09-.95.08-1.41-.01V16.5c0 1.82-.82 3.5-2.24 4.63-1.18.94-2.66 1.32-4.12 1.1-2.38-.37-4.24-2.36-4.47-4.76-.09-.94.08-1.88.5-2.73.35-.7.88-1.33 1.55-1.83.08-.06.22-.17.22-.17V10z" />
                        </svg>
                        <FormLabel className="mb-0">TikTok</FormLabel>
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                        <FormLabel className="mb-0">Website</FormLabel>
                      </div>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </div>
          
          {/* Column 2: Bio and Headshot */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Bio</h3>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="min-h-[300px] resize-y" 
                        placeholder="Enter guest bio here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Profile Image</h3>
              <HeadshotSection 
                initialImageUrl={guest?.imageUrl} 
                guestName={guest?.name || 'Guest'}
                onImageChange={handleImageChange}
              />
            </Card>
          </div>
          
          {/* Column 3: Notes */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Personal Notes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Private notes about this guest that won't be shared publicly.
              </p>
              <NotesSection
                notes={notes}
                setNotes={setNotes}
              />
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Guest"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
