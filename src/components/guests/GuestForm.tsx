
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { ContentSection } from "./form-sections/ContentSection";
import { SocialLinksSection } from "./form-sections/SocialLinksSection";
import { HeadshotSection } from "./form-sections/HeadshotSection";
import { NotesSection } from "./form-sections/NotesSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { FormProvider } from "react-hook-form";

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
  website: z.string().optional(),
});

type GuestFormValues = z.infer<typeof GuestFormSchema>;

export function GuestForm({ defaultValues, onSubmit, cancelHref }: any) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(GuestFormSchema),
    defaultValues: defaultValues || {
      name: "",
      title: "",
      company: "",
      email: "",
      phone: "",
      bio: "",
      status: "potential",
      twitter: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      website: "",
    },
  });

  const handleSubmit = async (values: GuestFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast({
        title: "Success",
        description: defaultValues
          ? "Guest updated successfully!"
          : "Guest created successfully!",
      });
      navigate("/guests"); // Navigate back to guests list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Bio & Content</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="headshot">Headshot</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoSection isSubmitting={isSubmitting} cancelHref={cancelHref} />
          </TabsContent>

          <TabsContent value="content">
            <ContentSection />
          </TabsContent>

          <TabsContent value="social">
            <SocialLinksSection />
          </TabsContent>

          <TabsContent value="headshot">
            <HeadshotSection />
          </TabsContent>

          <TabsContent value="notes">
            <NotesSection />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
