
import { useState } from "react";
import { Guest } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { Twitter, Linkedin, Instagram, Globe, Youtube, Plus, Trash } from "lucide-react";

interface GuestFormProps {
  guest: Guest;
  onSave: (updatedGuest: Guest) => void;
  onCancel: () => void;
}

export function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
  const [socialLinks, setSocialLinks] = useState(guest.socialLinks);
  const [otherLinks, setOtherLinks] = useState(guest.socialLinks.other || []);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);

  const form = useForm({
    defaultValues: {
      name: guest.name,
      title: guest.title,
      email: guest.email || "",
      phone: guest.phone || "",
      bio: guest.bio,
      notes: guest.notes || "",
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
      notes: data.notes || undefined,
      status: data.status,
      socialLinks: {
        twitter: data.twitter || undefined,
        linkedin: data.linkedin || undefined,
        instagram: data.instagram || undefined,
        youtube: data.youtube || undefined,
        website: data.website || undefined,
        other: otherLinks.length > 0 ? otherLinks : undefined,
      },
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedGuest);
  };

  const addOtherLink = () => {
    if (newLinkLabel && newLinkUrl) {
      setOtherLinks([...otherLinks, { label: newLinkLabel, url: newLinkUrl }]);
      setNewLinkLabel("");
      setNewLinkUrl("");
      setShowAddLinkDialog(false);
    }
  };

  const removeOtherLink = (index: number) => {
    const updatedLinks = [...otherLinks];
    updatedLinks.splice(index, 1);
    setOtherLinks(updatedLinks);
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
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={3}
                      placeholder="Private notes about this guest" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Other Links</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddLinkDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Link
              </Button>
            </div>

            {otherLinks.length > 0 ? (
              <div className="space-y-3">
                {otherLinks.map((link, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{link.label}</p>
                      <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeOtherLink(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground text-sm">No additional links added</p>
              </div>
            )}
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

      {/* Dialog for adding a new link */}
      <Dialog open={showAddLinkDialog} onOpenChange={setShowAddLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="linkLabel">Link Label</Label>
              <Input
                id="linkLabel"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="e.g., Personal Blog, GitHub Profile"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddLinkDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={addOtherLink}>
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
