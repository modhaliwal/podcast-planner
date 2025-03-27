// Import only the necessary part to fix the "success" variant error
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormField } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { generateGuestBio } from "@/lib/api/guest";
import { toast } from "@/hooks/use-toast";
import { FormActions } from "@/components/ui/form-actions";
import { useFormContext } from "react-hook-form";
import { ContentGenerator } from "@/components/content/ContentGenerator";

interface BasicInfoSectionProps {
  isSubmitting: boolean;
  cancelHref?: string;
}

export function BasicInfoSection({ isSubmitting, cancelHref }: BasicInfoSectionProps) {
  const { control, setValue, getValues } = useFormContext();
  const { name: nameFieldName } = useFormField();
  const name = getValues(nameFieldName);
  const [generating, setGenerating] = useState(false);

  const handleGenerateBio = async () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a name to generate a bio.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const response = await generateGuestBio({ name });
      if (response?.bio) {
        setValue("bio", response.bio);
        toast({
          title: "Success",
          description: "Bio generated successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate bio.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating bio:", error);
      toast({
        title: "Error",
        description: "Failed to generate bio.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Full name" {...control._fields.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Title" {...control._fields.title} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Company" {...control._fields.company} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" type="email" {...control._fields.email} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Phone" type="tel" {...control._fields.phone} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" placeholder="Status" {...control._fields.status} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="bio">Bio</Label>
            <ContentGenerator
              config={{
                fieldName: "bio",
                promptKey: "guest_bio",
                buttonLabel: generating ? "Generating..." : "Generate Bio",
                loadingLabel: "Generating bio...",
                edgeFunctionName: "generate-content",
                generationType: "bio",
              }}
              form={{ control, setValue, getValues }}
            />
          </div>
          <Textarea id="bio" placeholder="Bio" className="min-h-[100px]" {...control._fields.bio} />
        </div>
      </div>

      <FormActions isSubmitting={isSubmitting} cancelHref={cancelHref} />
    </>
  );
}
