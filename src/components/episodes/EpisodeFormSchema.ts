
import { z } from "zod";
import { EpisodeStatus } from "@/lib/enums";

// Define the ContentVersion schema
const contentVersionSchema = z.object({
  id: z.string(),
  content: z.string(),
  timestamp: z.string(),
  source: z.enum(['manual', 'ai', 'import']),
  active: z.boolean().optional() // Add active flag to schema
});

// Define the shape of the episode form
export const episodeFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  episodeNumber: z.number().int().positive(),
  topic: z.string().nullable().optional(),
  introduction: z.string().optional(),
  notes: z.string().optional().default(''),
  notesVersions: z.array(contentVersionSchema).optional().default([]),
  status: z.nativeEnum(EpisodeStatus),
  scheduled: z.date(),
  publishDate: z.date().nullable().optional(),
  guestIds: z.array(z.string()),
  coverArt: z.any().optional(),
  recordingLinks: z.object({
    audio: z.string().optional(),
    video: z.string().optional(),
    transcript: z.string().optional(),
    other: z.array(
      z.object({
        label: z.string(),
        url: z.string()
      })
    ).optional()
  }).optional(),
  podcastUrls: z.object({
    spotify: z.string().optional(),
    applePodcasts: z.string().optional(),
    amazonPodcasts: z.string().optional(),
    youtube: z.string().optional()
  }).optional(),
  resources: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
      description: z.string().optional()
    })
  ).optional()
});

// Typescript type for the episode form
export type EpisodeFormValues = z.infer<typeof episodeFormSchema>;
